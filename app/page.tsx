'use client';

import { useEffect, useState, useCallback } from 'react';
import SummaryCards from '@/components/SummaryCards';
import SectorGroup from '@/components/SectorGroup';
import {
  Holding, LiveStockData, PortfolioRow, SectorSummary, PortfolioSummary
} from '@/lib/types/portfolio';
import {
  calculatePortfolioRow, calculateTotalPortfolioValue, groupBySector, calculateOverallSummary
} from '@/lib/utils/calculations';
import holdingsData from '@/data/holdings.json';
import { RefreshCw, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const [sectorSummaries, setSectorSummaries] = useState<SectorSummary[]>([]);
  const [overallSummary, setOverallSummary] = useState<PortfolioSummary>({
    totalInvestment: 0, totalPresentValue: 0, totalGainLoss: 0, totalGainLossPercentage: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPortfolioData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setError(null);

      const response = await fetch('/api/stocks');
      const result = await response.json();

      if (!result.success) throw new Error(result.error || 'Failed to fetch');

      const liveData: LiveStockData[] = result.data;
      const liveDataMap = new Map<string, LiveStockData>();
      liveData.forEach(data => liveDataMap.set(data.symbol, data));

      const totalValue = calculateTotalPortfolioValue(holdingsData as Holding[], liveDataMap);

      const rows: PortfolioRow[] = (holdingsData as Holding[]).map(holding => {
        const liveStockData = liveDataMap.get(holding.symbol) || null;
        return calculatePortfolioRow(holding, liveStockData, totalValue);
      });

      setSectorSummaries(groupBySector(rows));
      setOverallSummary(calculateOverallSummary(rows));
      setLastUpdated(new Date());
      setIsLoading(false);
      setIsRefreshing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolioData();
    const interval = setInterval(fetchPortfolioData, 15000); // Auto-refresh every 15s
    return () => clearInterval(interval);
  }, [fetchPortfolioData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Portfolio Dashboard</h1>
            {lastUpdated && (
              <p className="text-xs text-gray-500">Last updated: {lastUpdated.toLocaleTimeString()}</p>
            )}
          </div>
          <button
            onClick={() => fetchPortfolioData()}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-red-600 mt-0.5" size={20} />
            <div>
              <h3 className="text-sm font-semibold text-red-800">Error Loading Data</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <SummaryCards summary={overallSummary} isLoading={isLoading} />

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 mt-2">Fetching live data...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sectorSummaries.map(sector => (
              <SectorGroup key={sector.sector} sector={sector} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
