import * as SQLite from 'expo-sqlite';
import { Sale, Lead, LeadStatus } from '../types';

let db: SQLite.SQLiteDatabase | null = null;

class DatabaseService {
    async init(): Promise<void> {
        if (db) return;
        // Using a fresh database name to ensure schema consistency
        db = await SQLite.openDatabaseAsync('sales_v3.db');

        // Optimize for speed
        await db.execAsync('PRAGMA journal_mode = WAL;');
        await db.execAsync('PRAGMA synchronous = NORMAL;');

        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        status TEXT NOT NULL,
        value REAL NOT NULL,
        notes TEXT,
        email TEXT,
        phone TEXT,
        business_name TEXT,
        address TEXT,
        created_at INTEGER NOT NULL
      );
      
      -- Indexes for performance
      CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
      CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
      CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(date);
    `);
        console.log("SQLite DB Initialized (v3) with WAL & Indexes");
    }

    public async getSales(): Promise<Sale[]> {
        if (!db) await this.init();
        if (!db) return [];
        return await db.getAllAsync<Sale>('SELECT * FROM sales ORDER BY date DESC');
    }

    public async addSale(description: string, amount: number, date: string): Promise<void> {
        if (!db) await this.init();
        if (!db) throw new Error("DB not initialized");
        await db.runAsync(
            'INSERT INTO sales (description, amount, date, created_at) VALUES (?, ?, ?, ?)',
            description, amount, date, Date.now()
        );
    }

    public async getRevenueStats() {
        if (!db) await this.init();
        if (!db) return { total: 0, count: 0 };

        const result = await db.getAllAsync<{ total: number, count: number }>("SELECT SUM(amount) as total, COUNT(*) as count FROM sales");

        if (result.length > 0) {
            return {
                total: result[0].total || 0,
                count: result[0].count || 0
            };
        }
        return { total: 0, count: 0 };
    }


    // --- LEADS ---

    public async getLeads(): Promise<Lead[]> {
        if (!db) await this.init();
        if (!db) return [];
        return await db.getAllAsync<Lead>('SELECT id, name, status, value, notes, email, phone, business_name as businessName, address, created_at as createdAt FROM leads ORDER BY created_at DESC');
    }

    public async addLead(
        name: string,
        value: number,
        status: string,
        notes?: string,
        email?: string,
        phone?: string,
        businessName?: string,
        address?: string
    ): Promise<void> {
        if (!db) await this.init();
        if (!db) throw new Error("DB not initialized");
        await db.runAsync(
            'INSERT INTO leads (name, value, status, notes, email, phone, business_name, address, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            name, value, status, notes || '', email || '', phone || '', businessName || '', address || '', Date.now()
        );
    }

    public async updateLead(lead: Lead): Promise<void> {
        if (!db) await this.init();
        if (!db) throw new Error("DB not initialized");
        await db.runAsync(
            'UPDATE leads SET name = ?, value = ?, status = ?, notes = ?, email = ?, phone = ?, business_name = ?, address = ? WHERE id = ?',
            lead.name, lead.value, lead.status, lead.notes || '', lead.email || '', lead.phone || '', lead.businessName || '', lead.address || '', lead.id
        );
    }

    public async updateLeadStatus(id: number, status: string): Promise<void> {
        if (!db) await this.init();
        if (!db) throw new Error("DB not initialized");
        await db.runAsync(
            'UPDATE leads SET status = ? WHERE id = ?',
            status, id
        );
    }

    public async deleteLead(id: number): Promise<void> {
        if (!db) await this.init();
        if (!db) throw new Error("DB not initialized");
        await db.runAsync('DELETE FROM leads WHERE id = ?', id);
    }

    public async deleteSale(id: number): Promise<void> {
        if (!db) await this.init();
        if (!db) throw new Error("DB not initialized");
        await db.runAsync('DELETE FROM sales WHERE id = ?', id);
    }

    public async getLeadStatistics() {
        if (!db) await this.init();
        if (!db) return { total: 0, won: 0, lost: 0, active: 0, pipelineValue: 0, conversionRate: 0 };

        const result = await db.getAllAsync<{ total: number, won: number, lost: number, pipelineValue: number }>(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Won' THEN 1 ELSE 0 END) as won,
                SUM(CASE WHEN status = 'Lost' THEN 1 ELSE 0 END) as lost,
                SUM(CASE WHEN status NOT IN ('Won', 'Lost') THEN value ELSE 0 END) as pipelineValue
            FROM leads
        `);

        if (result.length > 0) {
            const stats = result[0];
            const total = stats.total || 0;
            const won = stats.won || 0;
            const lost = stats.lost || 0;
            const active = total - won - lost;
            const conversionRate = total > 0 ? (won / total) * 100 : 0;

            return {
                total,
                won,
                lost,
                active,
                pipelineValue: stats.pipelineValue || 0,
                conversionRate: Math.round(conversionRate)
            };
        }
        return { total: 0, won: 0, lost: 0, active: 0, pipelineValue: 0, conversionRate: 0 };
    }

    public async resetDatabase(): Promise<void> {
        if (!db) await this.init();
        if (!db) throw new Error("DB not initialized");
        await db.execAsync(`
            DELETE FROM leads;
            DELETE FROM sales;
        `);
    }

    public async seedDummyData(): Promise<void> {
        if (!db) await this.init();
        if (!db) throw new Error("DB not initialized");

        try {
            // Drop and recreate to be 100% sure of state
            await db.execAsync(`
                DELETE FROM leads;
                DELETE FROM sales;
            `);

            const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Olivia', 'James', 'Sophia', 'Robert', 'Isabella', 'William', 'Mia', 'Joseph', 'Charlotte', 'Thomas', 'Amelia'];
            const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas'];
            const industries = ['Tech', 'Solutions', 'Logistics', 'Ventures', 'Group', 'Inc', 'Partners', 'Systems', 'Digital', 'Creative', 'Global', 'Direct'];
            const services = ['Consulting', 'Development', 'Marketing', 'Integration', 'Strategy', 'Optimization', 'Management', 'Design'];
            const statuses: LeadStatus[] = ['Cold', 'Warm', 'Hot', 'Won', 'Lost'];

            const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
            const getRandomValue = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

            const now = new Date();

            await db.withTransactionAsync(async () => {
                // 1. Generate 40 coherent Leads
                for (let i = 0; i < 40; i++) {
                    const firstName = getRandom(firstNames);
                    const lastName = getRandom(lastNames);
                    const name = `${firstName} ${lastName}`;
                    const industry = getRandom(industries);
                    const service = getRandom(services);
                    const businessName = `${industry} ${service}`;
                    const status = getRandom(statuses);
                    const value = getRandomValue(5000, 85000);
                    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${industry.toLowerCase()}.com`;
                    const phone = `+1 (555) ${getRandomValue(100, 999)}-${getRandomValue(1000, 9999)}`;

                    // Random date within last 6 months
                    const monthsAgo = getRandomValue(0, 5);
                    const daysAgo = getRandomValue(0, 28);
                    const leadDate = new Date(now.getTime() - (monthsAgo * 30 * 24 * 60 * 60 * 1000) - (daysAgo * 24 * 60 * 60 * 1000));

                    // Use await inside transaction is fine with async transaction
                    // But db inside transaction usually requires passed tx object?
                    // expo-sqlite new API uses db directly inside async transaction wrapper usually.
                    // Wait, db.runAsync is correct.
                    if (!db) return;

                    await db.runAsync(
                        'INSERT INTO leads (name, value, status, notes, email, phone, business_name, address, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        name, value, status, `Interested in ${service.toLowerCase()} solutions.`, email, phone, businessName, '123 Business Way, Suite 100', leadDate.getTime()
                    );

                    // 2. If the lead is 'Won', also create a Sale record
                    if (status === 'Won') {
                        await db.runAsync(
                            'INSERT INTO sales (description, amount, date, created_at) VALUES (?, ?, ?, ?)',
                            `Contract: ${businessName}`, value, leadDate.toISOString(), Date.now()
                        );
                    }
                }

                // 3. Generate extra historical Sales
                for (let i = 0; i < 20; i++) {
                    const amount = getRandomValue(8000, 45000);
                    const monthsAgo = getRandomValue(0, 5);
                    const daysAgo = getRandomValue(0, 28);
                    const saleDate = new Date(now.getTime() - (monthsAgo * 30 * 24 * 60 * 60 * 1000) - (daysAgo * 24 * 60 * 60 * 1000));

                    if (!db) return;
                    await db.runAsync(
                        'INSERT INTO sales (description, amount, date, created_at) VALUES (?, ?, ?, ?)',
                        `Closed Deal: ${getRandom(industries)} ${getRandom(services)}`, amount, saleDate.toISOString(), Date.now()
                    );
                }
            });

            console.log('Seeding complete (Transaction)');
        } catch (error) {
            console.error('Seed Error:', error);
            throw error;
        }
    }
}

export const dbService = new DatabaseService();
