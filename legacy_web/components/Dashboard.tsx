import React from 'react';
import { Sale, DashboardStats } from '../types';

interface DashboardProps {
  stats: DashboardStats;
  onViewAll: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, onViewAll }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-24">
      {/* Hero Card */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-900/50 border border-slate-800">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-400 text-sm font-medium">Total Revenue</p>
            <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-bold rounded-md flex items-center gap-1 backdrop-blur-sm border border-primary/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              +12.5%
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-6">
            <h2 className="text-4xl font-bold tracking-tight text-white">{formatCurrency(stats.totalRevenue)}</h2>
          </div>
          
          {/* Simulated Sparkline */}
          <div className="flex items-end gap-1 w-full h-12 opacity-90">
            {[40, 60, 35, 70, 55, 90, 75, 100].map((h, i) => (
              <div 
                key={i} 
                className="flex-1 bg-primary rounded-t-sm transition-all duration-500 hover:opacity-100" 
                style={{ height: `${h}%`, opacity: 0.5 + (i * 0.05) }}
              ></div>
            ))}
          </div>
        </div>
        {/* Background Decor */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/40 to-transparent"></div>
      </section>

      {/* Mini Stats Grid */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Transactions</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.totalTransactions}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4 text-slate-600 dark:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Completion</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">100%</p>
        </div>
      </section>

      {/* Database Status Indicator */}
      <section className="bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
             <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
             <div className="absolute top-0 left-0 w-2.5 h-2.5 bg-primary rounded-full animate-ping opacity-75"></div>
          </div>
          <div className="text-sm">
            <span className="font-semibold text-slate-900 dark:text-slate-200">SQLite Active</span>
            <span className="text-slate-500 dark:text-slate-400 ml-1 text-xs">Local-First DB</span>
          </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s8-1.79 8-4" />
        </svg>
      </section>

      {/* Recent Sales Preview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Recent Activity</h3>
          <button onClick={onViewAll} className="text-yellow-600 dark:text-primary text-sm font-semibold hover:text-yellow-700 transition-colors">View All</button>
        </div>
        
        <div className="space-y-3">
          {stats.recentSales.slice(0, 3).map((sale) => (
            <div key={sale.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center font-bold text-slate-500 dark:text-slate-300 text-sm">
                  {sale.description.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{sale.description}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(sale.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-800 dark:text-slate-100">{formatCurrency(sale.amount)}</p>
              </div>
            </div>
          ))}
          {stats.recentSales.length === 0 && (
             <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-dashed border border-slate-200 dark:border-slate-700">
               No sales recorded yet
             </div>
          )}
        </div>
      </section>
    </div>
  );
};