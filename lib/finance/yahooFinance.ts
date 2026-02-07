import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();
import { cache } from '../utils/cache';

export async function fetchCMP(symbol: string): Promise<number | null> {
    try {
        const cacheKey = `yahoo_${symbol}`;
        // Check cache first to avoid hitting rate limits
        const cached = cache.get<number>(cacheKey);
        if (cached !== null) return cached;

        // Use any to bypass complex library return types
        const quote: any = await yahooFinance.quote(symbol, { return: 'object' });
        const cmp = quote?.regularMarketPrice;

        if (!cmp) return null;

        cache.set(cacheKey, cmp, 60000); // 1 min cache
        return cmp;
    } catch (error: any) {
        console.error(`[Yahoo] Error for ${symbol}:`, error.message);
        return null;
    }
}

export async function fetchMultipleCMP(symbols: string[]): Promise<Map<string, number | null>> {
    const results = new Map<string, number | null>();

    // Parallel fetch is critical here to keep the API response fast
    const responses = await Promise.all(
        symbols.map(async (symbol) => {
            const cmp = await fetchCMP(symbol);
            return { symbol, cmp };
        })
    );

    responses.forEach(({ symbol, cmp }) => {
        results.set(symbol, cmp);
    });

    return results;
}
