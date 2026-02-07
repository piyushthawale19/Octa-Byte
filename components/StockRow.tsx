import { PortfolioRow } from '@/lib/types/portfolio';
import { formatCurrency, formatPercentage } from '@/lib/utils/calculations';

interface StockRowProps {
    data: PortfolioRow;
}

export default function StockRow({ data }: StockRowProps) {
    const isProfit = data.gainLoss >= 0;

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3 text-sm font-medium text-gray-900 text-left">
                {data.particulars}
                <div className="text-xs text-gray-500">{data.symbol}</div>
            </td>
            <td className="px-4 py-3 text-sm text-right text-gray-700">{formatCurrency(data.purchasePrice)}</td>
            <td className="px-4 py-3 text-sm text-right text-gray-700">{data.quantity}</td>
            <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">{formatCurrency(data.investment)}</td>
            <td className="px-4 py-3 text-sm text-right text-gray-700">{data.portfolioPercentage.toFixed(2)}%</td>
            <td className="px-4 py-3 text-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {data.exchange}
                </span>
            </td>
            <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">{formatCurrency(data.cmp)}</td>
            <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">{formatCurrency(data.presentValue)}</td>
            <td className="px-4 py-3 text-sm text-right">
                <div className="flex flex-col items-end gap-1">
                    <span className={`font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(data.gainLoss)}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${isProfit ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {formatPercentage(data.gainLossPercentage)}
                    </span>
                </div>
            </td>
            <td className="px-4 py-3 text-sm text-right text-gray-700">{data.peRatio !== null ? data.peRatio.toFixed(2) : <span className="text-gray-400 italic">N/A</span>}</td>
            <td className="px-4 py-3 text-sm text-right text-gray-700">{data.latestEarnings || <span className="text-gray-400 italic">N/A</span>}</td>
        </tr>
    );
}
