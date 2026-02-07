export interface Holding {
    particulars: string;
    purchasePrice: number;
    quantity: number;
    exchange: 'NSE' | 'BSE';
    sector: string;
    symbol: string;
}

export interface LiveStockData {
    symbol: string;
    cmp: number;
    peRatio: number | null;
    latestEarnings: string | null;
    lastUpdated: Date;
}

export interface PortfolioRow extends Holding {
    investment: number;
    portfolioPercentage: number;
    cmp: number;
    presentValue: number;
    gainLoss: number;
    gainLossPercentage: number;
    peRatio: number | null;
    latestEarnings: string | null;
}

export interface SectorSummary {
    sector: string;
    totalInvestment: number;
    totalPresentValue: number;
    totalGainLoss: number;
    holdings: PortfolioRow[];
}

export interface PortfolioSummary {
    totalInvestment: number;
    totalPresentValue: number;
    totalGainLoss: number;
    totalGainLossPercentage: number;
}

export interface StockAPIResponse {
    success: boolean;
    data?: LiveStockData[];
    error?: string;
    cachedAt?: Date;
}
