'use client';

import { useState } from 'react';
import { SectorSummary } from '@/lib/types/portfolio';
import { formatCurrency, formatPercentage } from '@/lib/utils/calculations';
import { ChevronDown, ChevronUp } from 'lucide-react';
import StockRow from '@/components/StockRow'; // Fixed import path

interface SectorGroupProps {
    sector: SectorSummary;
}

export default function SectorGroup({ sector }: SectorGroupProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    const isProfit = sector.totalGainLoss >= 0; // Snapshot of performance

    return (
        <div className="mb-4 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">

            <div
                className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button className="text-gray-600 hover:text-gray-900">
                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                        <h3 className="text-lg font-bold text-gray-900">{sector.sector}</h3>
                        <span className="text-sm text-gray-500">
                            ({sector.holdings.length} {sector.holdings.length === 1 ? 'stock' : 'stocks'})
                        </span>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                        <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase">Inv.</p>
                            <p className="font-semibold text-gray-900">{formatCurrency(sector.totalInvestment)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase">Values</p>
                            <p className="font-semibold text-gray-900">{formatCurrency(sector.totalPresentValue)}</p>
                        </div>
                        <div className="text-right min-w-[140px]">
                            <p className="text-xs text-gray-500 uppercase">P&L</p>
                            <div className="flex items-center gap-2 justify-end">
                                <p className={`font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(sector.totalGainLoss)}
                                </p>
                                <span className={`text-xs font-semibold px-2 py-1 rounded ${isProfit ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {formatPercentage(sector.totalInvestment > 0 ? (sector.totalGainLoss / sector.totalInvestment) * 100 : 0)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>

                                {['Particulars', 'Purchase', 'Qty', 'Investment', 'Port %', 'Exch', 'CMP', 'Current Val', 'Total P&L', 'P/E', 'Earnings'].map((h, i) => (
                                    <th
                                        key={h}
                                        className={`px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider ${i === 0 ? 'text-left' : (i === 5 ? 'text-center' : 'text-right')}`}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sector.holdings.map((holding) => (
                                <StockRow key={holding.symbol} data={holding} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
