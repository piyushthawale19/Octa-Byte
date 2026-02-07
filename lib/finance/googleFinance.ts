import axios from "axios";
import * as cheerio from "cheerio";
import { cache } from "../utils/cache";

interface GoogleFinanceData {
  peRatio: number | null;
  latestEarnings: string | null;
}

// Google Finance uses NSE:SYMBOL format, while Yahoo uses SYMBOL.NS
function convertSymbolToGoogleFormat(symbol: string): string {
  if (symbol.endsWith(".NS")) return `NSE:${symbol.replace(".NS", "")}`;
  if (symbol.endsWith(".BO")) return `BSE:${symbol.replace(".BO", "")}`;
  return symbol;
}

export async function fetchGoogleFinanceData(
  symbol: string,
): Promise<GoogleFinanceData> {
  const cacheKey = `google_${symbol}`;

  try {
    const cached = cache.get<GoogleFinanceData>(cacheKey);
    if (cached !== null) return cached;

    const googleSymbol = convertSymbolToGoogleFormat(symbol);
    const url = `https://www.google.com/finance/quote/${googleSymbol}`;

    // Need headers to mimic a real browser to avoid 403s
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Cache-Control": "max-age=0",
      },
      timeout: 8000,
      validateStatus: (status) => status === 200,
    });

    const $ = cheerio.load(response.data);
    let peRatio: number | null = null;
    let latestEarnings: string | null = null;

    // Google's DOM structure is messy, so we check multiple patterns
    $('div[class*="ratio"]').each((_, element) => {
      const text = $(element).text();
      if (text.includes("PE ratio") || text.includes("P/E ratio")) {
        // Extract number from the sibling element's text
        const valueText = $(element).next().text() || text;
        const match = valueText.match(/[\d.]+/);
        if (match) peRatio = parseFloat(match[0]);
      }
    });

    // Fallback search for PE
    if (peRatio === null) {
      $("div").each((_, element) => {
        const text = $(element).text();
        const peMatch = text.match(/P\/E\s+ratio\s+([\d.]+)/i);
        if (peMatch) peRatio = parseFloat(peMatch[1]);
      });
    }

    $("div").each((_, element) => {
      const text = $(element).text();
      if (text.includes("Earnings") || text.includes("earnings")) {
        const valueText = $(element).next().text();
        if (valueText && valueText.match(/[₹$£€]\s?[\d,.]+/)) {
          latestEarnings = valueText.trim();
        }
      }
    });

    const result = { peRatio, latestEarnings };
    // Cache for 10 minutes to reduce API load
    cache.set(cacheKey, result, 600000);

    return result;
  } catch (error: any) {
    // Cache failures too to avoid hammering failed endpoints
    const nullResult = { peRatio: null, latestEarnings: null };
    cache.set(cacheKey, nullResult, 120000); // 2 min cache for failures
    console.warn(
      `[Google Scraper] Failed for ${symbol}:`,
      error.message || "Unknown error",
    );
    return nullResult;
  }
}

export async function fetchMultipleGoogleData(
  symbols: string[],
): Promise<Map<string, GoogleFinanceData>> {
  const results = new Map<string, GoogleFinanceData>();

  // Add delay between batches to avoid rate limiting
  const batchSize = 10;
  const batches = [];

  for (let i = 0; i < symbols.length; i += batchSize) {
    batches.push(symbols.slice(i, i + batchSize));
  }

  for (const batch of batches) {
    const responses = await Promise.all(
      batch.map(async (symbol) => {
        try {
          const data = await fetchGoogleFinanceData(symbol);
          return { symbol, data };
        } catch (error) {
          console.error(`[Google] Batch error for ${symbol}`);
          return { symbol, data: { peRatio: null, latestEarnings: null } };
        }
      }),
    );

    responses.forEach(({ symbol, data }) => results.set(symbol, data));

    // Small delay between batches (only if not last batch)
    if (batches.indexOf(batch) < batches.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return results;
}
