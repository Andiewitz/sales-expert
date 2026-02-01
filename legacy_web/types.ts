export interface Sale {
  id: number;
  description: string;
  amount: number;
  date: string; // ISO string
  created_at: number;
}

export type ViewState = 'dashboard' | 'history' | 'add' | 'settings';

export interface DashboardStats {
  totalRevenue: number;
  totalTransactions: number;
  monthlyGrowth: number;
  recentSales: Sale[];
}