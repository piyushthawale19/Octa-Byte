import axios from 'axios';
import * as cheerio from 'cheerio';
import { cache } from '../utils/cache';

interface GoogleFinanceData {
    peRatio: number | null;
    latestEarnings: string | null;
}

// Google Finance uses NSE:SYMBOL format, while Yahoo uses SYMBOL.NS
function convertSymbolToGoogleFormat(symbol: string): string {
    if (symbol.endsWith('.NS')) return `NSE:${symbol.replace('.NS', '')}`;
    if (symbol.endsWith('.BO')) return `BSE:${symbol.replace('.BO', '')}`;
    return symbol;
}

export async function fetchGoogleFinanceData(symbol: string): Promise<GoogleFinanceData> {
    try {
        const cacheKey = `google_${symbol}`;
        const cached = cache.get<GoogleFinanceData>(cacheKey);
        if (cached !== null) return cached;

        const googleSymbol = convertSymbolToGoogleFormat(symbol);
        const url = `https://www.google.com/finance/quote/${googleSymbol}`;

        // Need headers to mimic a real browser to avoid 403s
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
            timeout: 10000,
        });

        const $ = cheerio.load(response.data);
        let peRatio: number | null = null;
        let latestEarnings: string | null = null;

        // Google's DOM structure is messy, so we check multiple patterns
        $('div[class*="ratio"]').each((_, element) => {
            const text = $(element).text();
            if (text.includes('PE ratio') || text.includes('P/E ratio')) {
                // Extract number from the sibling element's text
                const valueText = $(element).next().text() || text;
                const match = valueText.match(/[\d.]+/);
                if (match) peRatio = parseFloat(match[0]);
            }
        });

        // Fallback search for PE
        if (peRatio === null) {
            $('div').each((_, element) => {
                const text = $(element).text();
                const peMatch = text.match(/P\/E\s+ratio\s+([\d.]+)/i);
                if (peMatch) peRatio = parseFloat(peMatch[1]);
            });
        }

        $('div').each((_, element) => {
            const text = $(element).text();
            if (text.includes('Earnings') || text.includes('earnings')) {
                const valueText = $(element).next().text();
                if (valueText && valueText.match(/[₹$£€]\s?[\d,.]+/)) {
                    latestEarnings = valueText.trim();
                }
            }
        });

        const result = { peRatio, latestEarnings };
        cache.set(cacheKey, result, 300000);

        return result;

    } catch (error: any) {
        console.warn(`[Google Scraper] Failed for ${symbol}`);
        return { peRatio: null, latestEarnings: null };
    }
}

export async function fetchMultipleGoogleData(symbols: string[]): Promise<Map<string, GoogleFinanceData>> {
    const results = new Map<string, GoogleFinanceData>();

    const responses = await Promise.all(
        symbols.map(async (symbol) => {
            const data = await fetchGoogleFinanceData(symbol);
            return { symbol, data };
        })
    );

    responses.forEach(({ symbol, data }) => results.set(symbol, data));
    return results;
}
