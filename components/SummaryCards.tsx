import { PortfolioSummary } from '@/lib/types/portfolio';
import { formatCurrency, formatPercentage } from '@/lib/utils/calculations';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';

interface SummaryCardsProps {
    summary: PortfolioSummary;
    isLoading: boolean;
}

export default function SummaryCards({ summary, isLoading }: SummaryCardsProps) {
    const isProfit = summary.totalGainLoss >= 0;

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-blue-700">Total Investment</h3>
                    <div className="p-2 bg-blue-200 rounded-lg">
                        <Wallet className="w-5 h-5 text-blue-700" />
                    </div>
                </div>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(summary.totalInvestment)}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-md p-6 border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-purple-700">Present Value</h3>
                    <div className="p-2 bg-purple-200 rounded-lg">
                        <PiggyBank className="w-5 h-5 text-purple-700" />
                    </div>
                </div>
                <p className="text-2xl font-bold text-purple-900">{formatCurrency(summary.totalPresentValue)}</p>
            </div>

            <div className={`bg-gradient-to-br ${isProfit ? 'from-green-50 to-green-100 border-green-200' : 'from-red-50 to-red-100 border-red-200'} rounded-xl shadow-md p-6 border`}>
                <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-sm font-medium ${isProfit ? 'text-green-700' : 'text-red-700'}`}>Total Gain/Loss</h3>
                    <div className={`p-2 rounded-lg ${isProfit ? 'bg-green-200' : 'bg-red-200'}`}>
                        {isProfit ? <TrendingUp className="w-5 h-5 text-green-700" /> : <TrendingDown className="w-5 h-5 text-red-700" />}
                    </div>
                </div>
                <p className={`text-2xl font-bold ${isProfit ? 'text-green-900' : 'text-red-900'}`}>{formatCurrency(summary.totalGainLoss)}</p>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${isProfit ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                    {formatPercentage(summary.totalGainLossPercentage)}
                </span>
            </div>
        </div>
    );
}
