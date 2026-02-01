import { Sale } from '../types';

// Declare the global initSqlJs function provided by the CDN script
declare global {
  interface Window {
    initSqlJs: (config: any) => Promise<any>;
  }
}

class DatabaseService {
  private db: any = null;
  private SQL: any = null;
  private readonly DB_KEY = 'sales_expert_sqlite_dump';

  async init(): Promise<void> {
    if (this.db) return;

    try {
      // Initialize SQL.js
      this.SQL = await window.initSqlJs({
        locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
      });

      // Check for existing data in LocalStorage (simulating persistent filesystem)
      const savedData = localStorage.getItem(this.DB_KEY);
      
      if (savedData) {
        const uInt8Array = new Uint8Array(JSON.parse(savedData));
        this.db = new this.SQL.Database(uInt8Array);
      } else {
        this.db = new this.SQL.Database();
        this.createTables();
      }
      
      console.log("SQLite Database initialized");
    } catch (error) {
      console.error("Failed to initialize database", error);
      throw error;
    }
  }

  private createTables() {
    const query = `
      CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
    `;
    this.db.run(query);
    this.save();
  }

  // Persist the binary database file to local storage
  private save() {
    const data = this.db.export();
    // Convert Uint8Array to regular array for JSON serialization
    localStorage.setItem(this.DB_KEY, JSON.stringify(Array.from(data)));
  }

  public getSales(): Sale[] {
    if (!this.db) return [];
    
    const res = this.db.exec("SELECT * FROM sales ORDER BY date DESC");
    if (res.length === 0) return [];

    const columns = res[0].columns;
    const values = res[0].values;

    return values.map((row: any[]) => {
      const sale: any = {};
      columns.forEach((col: string, index: number) => {
        sale[col] = row[index];
      });
      return sale as Sale;
    });
  }

  public addSale(description: string, amount: number, date: string): void {
    if (!this.db) throw new Error("Database not initialized");

    const query = `
      INSERT INTO sales (description, amount, date, created_at) 
      VALUES (?, ?, ?, ?)
    `;
    const stmt = this.db.prepare(query);
    stmt.run([description, amount, date, Date.now()]);
    stmt.free();
    
    this.save();
  }

  public getRevenueStats() {
    if (!this.db) return { total: 0, count: 0 };
    
    const res = this.db.exec("SELECT SUM(amount) as total, COUNT(*) as count FROM sales");
    if (res.length === 0 || !res[0].values[0]) return { total: 0, count: 0 };
    
    const [total, count] = res[0].values[0];
    return {
      total: total || 0,
      count: count || 0
    };
  }
}

export const dbService = new DatabaseService();
