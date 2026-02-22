export interface Sale {
    id: number;
    description: string;
    amount: number;
    date: string; // ISO string
    created_at: number;
}

export type LeadStatus = 'Cold' | 'Warm' | 'Hot' | 'Won' | 'Lost';

export interface Lead {
    id: number;
    name: string;
    status: LeadStatus;
    value: number;
    notes?: string;
    email?: string;
    phone?: string;
    businessName?: string;
    address?: string;
    createdAt: number;
}

export type ViewState = 'dashboard' | 'history' | 'leads' | 'add' | 'settings';

export interface DashboardStats {
    totalRevenue: number;
    totalTransactions: number;
    monthlyGrowth: number;
    recentSales: Sale[];
    pipelineCounts?: { [key in LeadStatus]?: number };
}
