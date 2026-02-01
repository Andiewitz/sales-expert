import React from 'react';
import { Sale } from '../types';

interface HistoryProps {
  sales: Sale[];
}

export const History: React.FC<HistoryProps> = ({ sales }) => {
  return (
    <div className="space-y-4 animate-fade-in pb-24">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Transactions</h2>
      
      <div className="space-y-3">
        {sales.map((sale) => (
          <div key={sale.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{sale.description}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(sale.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-900 dark:text-white text-lg">
                ${sale.amount.toLocaleString()}
              </p>
              <p className="text-xs text-slate-400 font-medium">Completed</p>
            </div>
          </div>
        ))}
        
        {sales.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p>No transactions yet</p>
            </div>
        )}
      </div>
    </div>
  );
};