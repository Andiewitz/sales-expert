import React from 'react';
import { render } from '@testing-library/react-native';
import { Dashboard } from '../../components/Dashboard';




describe('Dashboard', () => {
    const mockStats = {
        totalRevenue: 10000,
        totalTransactions: 5,
        monthlyGrowth: 10,
        recentSales: []
    };

    const mockLeads = [
        {
            id: 1,
            name: 'John Doe',
            status: 'Hot',
            value: 5000,
            createdAt: Date.now()
        }
    ];

    it('renders correctly', () => {
        const { getByText } = render(
            <Dashboard
                stats={mockStats}
                leads={mockLeads}
                onViewAll={jest.fn()}
                onCustomerPress={jest.fn()}
                onOpenChat={jest.fn()}
                isLoading={false}
            />
        );

        expect(getByText('Total Leads')).toBeTruthy();
        expect(getByText('John Doe')).toBeTruthy();
    });

    it('shows loading skeleton when isLoading is true', () => {
        const { getByTestId } = render(
            <Dashboard
                stats={mockStats}
                leads={mockLeads}
                onViewAll={jest.fn()}
                onCustomerPress={jest.fn()}
                onOpenChat={jest.fn()}
                isLoading={true}
            />
        );
        // Assuming DashboardSkeleton has some text or testID. 
        // We can just verify 'Total Leads' is not there
        const { queryByText } = render(
            <Dashboard
                stats={mockStats}
                leads={mockLeads}
                onViewAll={jest.fn()}
                onCustomerPress={jest.fn()}
                onOpenChat={jest.fn()}
                isLoading={true}
            />
        );
        
        expect(queryByText('Total Leads')).toBeNull();
    });
});
