import {
    Holding, LiveStockData, PortfolioRow, SectorSummary, PortfolioSummary
} from '../types/portfolio';

export function calculatePortfolioRow(
    holding: Holding,
    liveData: LiveStockData | null,
    totalPortfolioValue: number
): PortfolioRow {
    const investment = holding.purchasePrice * holding.quantity;

    // Use live price if available, otherwise just use purchase price
    const cmp = liveData?.cmp ?? holding.purchasePrice;
    const presentValue = cmp * holding.quantity;
    const gainLoss = presentValue - investment;
    const gainLossPercentage = investment > 0 ? (gainLoss / investment) * 100 : 0;

    const portfolioPercentage = totalPortfolioValue > 0
        ? (presentValue / totalPortfolioValue) * 100
        : 0;

    return {
        ...holding,
        investment,
        portfolioPercentage,
        cmp,
        presentValue,
        gainLoss,
        gainLossPercentage,
        peRatio: liveData?.peRatio ?? null,
        latestEarnings: liveData?.latestEarnings ?? null
    };
}

export function groupBySector(rows: PortfolioRow[]): SectorSummary[] {
    const sectorMap = new Map<string, PortfolioRow[]>();

    rows.forEach(row => {
        const existing = sectorMap.get(row.sector) || [];
        existing.push(row);
        sectorMap.set(row.sector, existing);
    });

    const summaries: SectorSummary[] = [];

    sectorMap.forEach((holdings, sector) => {
        summaries.push({
            sector,
            totalInvestment: holdings.reduce((sum, h) => sum + h.investment, 0),
            totalPresentValue: holdings.reduce((sum, h) => sum + h.presentValue, 0),
            totalGainLoss: holdings.reduce((sum, h) => sum + h.gainLoss, 0),
            holdings
        });
    });

    return summaries.sort((a, b) => b.totalInvestment - a.totalInvestment);
}

export function calculateOverallSummary(rows: PortfolioRow[]): PortfolioSummary {
    const totalInvestment = rows.reduce((sum, row) => sum + row.investment, 0);
    const totalPresentValue = rows.reduce((sum, row) => sum + row.presentValue, 0);
    const totalGainLoss = rows.reduce((sum, row) => sum + row.gainLoss, 0);

    return {
        totalInvestment,
        totalPresentValue,
        totalGainLoss,
        totalGainLossPercentage: totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0
    };
}

export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

export function formatPercentage(value: number): string {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export function calculateTotalPortfolioValue(
    holdings: Holding[],
    liveDataMap: Map<string, LiveStockData>
): number {
    return holdings.reduce((total, holding) => {
        const liveData = liveDataMap.get(holding.symbol);
        const cmp = liveData?.cmp ?? holding.purchasePrice;
        return total + (cmp * holding.quantity);
    }, 0);
}
