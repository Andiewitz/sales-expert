import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { dbService } from './services/db';
import { Dashboard } from './components/Dashboard';
import { History } from './components/History';
import { Settings } from './components/Settings';
import { AddSaleModal } from './components/AddSaleModal';
import { Sale, ViewState } from './types';

function App() {
  const [isDbReady, setIsDbReady] = useState(false);
  const [sales, setSales] = useState<Sale[]>([]);
  const [view, setView] = useState<ViewState>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Check localStorage or system preference on initial load
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  // Apply Theme Effect
  useEffect(() => {
    const root = window.document.documentElement;
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (theme === 'dark') {
      root.classList.add('dark');
      metaThemeColor?.setAttribute('content', '#0F172A'); // Slate 900
    } else {
      root.classList.remove('dark');
      metaThemeColor?.setAttribute('content', '#F8FAFC'); // Slate 50
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Initialize DB
  useEffect(() => {
    const init = async () => {
      try {
        await dbService.init();
        setIsDbReady(true);
        refreshData();
      } catch (e) {
        console.error("DB Init failed", e);
      }
    };
    init();
  }, []);

  const refreshData = useCallback(() => {
    if (dbService) {
      setSales(dbService.getSales());
    }
  }, []);

  const handleAddSale = (description: string, amount: number, date: string) => {
    try {
      dbService.addSale(description, amount, date);
      refreshData();
      setIsModalOpen(false);
    } catch (e) {
      alert("Error saving sale");
    }
  };

  const stats = useMemo(() => {
    const revenue = sales.reduce((acc, curr) => acc + curr.amount, 0);
    return {
      totalRevenue: revenue,
      totalTransactions: sales.length,
      monthlyGrowth: 12.5,
      recentSales: sales
    };
  }, [sales]);

  if (!isDbReady) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-400">Loading Secure Database...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen font-sans text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center shadow-lg shadow-black/20 ring-1 ring-slate-800">
             {/* Logo Icon simulation */}
             <div className="w-5 h-3 border-t-2 border-b-2 border-primary rounded-sm"></div>
          </div>
          <div>
            <h1 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sales Expert</h1>
            <p className="text-sm font-bold dark:text-white">
              {view === 'dashboard' ? 'Dashboard' : view === 'history' ? 'Transactions' : 'Configuration'}
            </p>
          </div>
        </div>
        <button 
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          {theme === 'dark' ? (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
             </svg>
          ) : (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
             </svg>
          )}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 overflow-y-auto no-scrollbar">
        {view === 'dashboard' && <Dashboard stats={stats} onViewAll={() => setView('history')} />}
        {view === 'history' && <History sales={sales} />}
        {view === 'settings' && <Settings isDarkMode={theme === 'dark'} toggleTheme={toggleTheme} />}
      </main>

      {/* Floating Action Button (Hide on settings) */}
      {view !== 'settings' && (
        <button 
          onClick={() => setIsModalOpen(true)}
          className="fixed right-6 bottom-24 w-14 h-14 bg-primary hover:bg-yellow-400 text-slate-900 rounded-full shadow-xl shadow-primary/30 flex items-center justify-center z-40 active:scale-90 transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      {/* Bottom Nav */}
      <nav className="sticky bottom-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe pt-3 px-8 safe-bottom transition-colors duration-300">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button 
            onClick={() => setView('dashboard')}
            className={`flex flex-col items-center gap-1 group transition-colors ${view === 'dashboard' ? 'text-slate-900 dark:text-primary' : 'text-slate-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={view === 'dashboard' ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] font-bold">Home</span>
          </button>

          <button 
            onClick={() => setView('history')}
            className={`flex flex-col items-center gap-1 group transition-colors ${view === 'history' ? 'text-slate-900 dark:text-primary' : 'text-slate-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={view === 'history' ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-[10px] font-bold">Sales</span>
          </button>

          <button 
            onClick={() => setView('settings')}
            className={`flex flex-col items-center gap-1 group transition-colors ${view === 'settings' ? 'text-slate-900 dark:text-primary' : 'text-slate-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={view === 'settings' ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-[10px] font-bold">Config</span>
          </button>
        </div>
      </nav>

      {/* Add Sale Overlay */}
      <AddSaleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddSale}
      />
    </div>
  );
}

export default App;