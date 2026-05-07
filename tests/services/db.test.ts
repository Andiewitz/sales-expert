import { dbService } from '../../services/db';
import * as SQLite from 'expo-sqlite';

jest.mock('expo-sqlite', () => {
    const mockExecAsync = jest.fn();
    const mockGetAllAsync = jest.fn();
    const mockRunAsync = jest.fn();
    const mockWithTransactionAsync = jest.fn((callback) => callback());
    
    return {
        openDatabaseAsync: jest.fn().mockResolvedValue({
            execAsync: mockExecAsync,
            getAllAsync: mockGetAllAsync,
            runAsync: mockRunAsync,
            withTransactionAsync: mockWithTransactionAsync,
        })
    };
});

describe('Database Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        dbService.__reset();
    });

    it('initializes the database', async () => {
        await dbService.init();
        expect(SQLite.openDatabaseAsync).toHaveBeenCalledWith('sales_v3.db');
    });

    it('adds a sale correctly', async () => {
        const mockRunAsync = jest.fn();
        (SQLite.openDatabaseAsync as jest.Mock).mockResolvedValue({
            execAsync: jest.fn(),
            runAsync: mockRunAsync,
        });

        await dbService.init();
        await dbService.addSale('Test Sale', 100, '2023-01-01');

        expect(mockRunAsync).toHaveBeenCalledWith(
            'INSERT INTO sales (description, amount, date, created_at) VALUES (?, ?, ?, ?)',
            'Test Sale',
            100,
            '2023-01-01',
            expect.any(Number)
        );
    });

    it('retrieves leads correctly', async () => {
        const mockGetAllAsync = jest.fn().mockResolvedValue([{ id: 1, name: 'Lead 1' }]);
        (SQLite.openDatabaseAsync as jest.Mock).mockResolvedValue({
            execAsync: jest.fn(),
            getAllAsync: mockGetAllAsync,
        });

        await dbService.init();
        await dbService.getLeads();

        expect(mockGetAllAsync).toHaveBeenCalledWith(
            'SELECT id, name, status, value, notes, email, phone, business_name as businessName, address, created_at as createdAt FROM leads ORDER BY created_at DESC'
        );
    });
});
