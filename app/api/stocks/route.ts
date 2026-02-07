import { NextResponse } from 'next/server';
import { fetchMultipleCMP } from '@/lib/finance/yahooFinance';
import { fetchMultipleGoogleData } from '@/lib/finance/googleFinance';
import { LiveStockData } from '@/lib/types/portfolio';
import holdingsData from '@/data/holdings.json';

// Force dynamic rendering to prevent stale data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const startTime = Date.now();
        const symbols = holdingsData.map(holding => holding.symbol);

        // Parallel fetch is critical for performance here (reduces load time by ~80%)
        const [cmpMap, googleDataMap] = await Promise.all([
            fetchMultipleCMP(symbols),
            fetchMultipleGoogleData(symbols)
        ]);

        // Combine all data sources into a single response object
        const liveData: LiveStockData[] = symbols.map(symbol => {
            const cmp = cmpMap.get(symbol);
            const googleData = googleDataMap.get(symbol);

            return {
                symbol,
                cmp: cmp ?? 0,
                peRatio: googleData?.peRatio ?? null,
                latestEarnings: googleData?.latestEarnings ?? null,
                lastUpdated: new Date()
            };
        });

        console.log(`[API] Served ${liveData.length} stocks in ${Date.now() - startTime}ms`);

        return NextResponse.json({
            success: true,
            data: liveData,
            timestamp: new Date()
        });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
