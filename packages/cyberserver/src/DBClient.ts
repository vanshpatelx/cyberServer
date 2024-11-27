import { Pool, PoolClient } from 'pg';

interface DBConfig {
    dbname: string;
    user: string;
    password: string;
    host: string;
    port: number;
    minconn?: number; // Optional, with default
    maxconn?: number; // Optional, with default
}

class DBClient {
    private static instance: DBClient | null = null;
    private pool: Pool;
    private client: PoolClient | null = null;

    private constructor(config: DBConfig) {
        const {
            dbname,
            user,
            password,
            host,
            port,
            minconn = 10, // Default minimum connections
            maxconn = 100, // Default maximum connections
        } = config;

        this.pool = new Pool({
            user,
            host,
            database: dbname,
            password,
            port,
            min: minconn,
            max: maxconn,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 1000,
        });
    }

    public static getInstance(config: DBConfig): DBClient {
        if (!DBClient.instance) {
            DBClient.instance = new DBClient(config);
        }
        return DBClient.instance;
    }

    public async initializeConnection(): Promise<void> {
        try {
            if (!this.client) {
                this.client = await this.pool.connect();
                console.log('Live connection established');
            }
        } catch (error) {
            console.error('Error establishing live connection:', error);
        }
    }

    public async executeQuery(query: string, params?: any[]): Promise<object[]> {
        if (!this.client) {
            console.error('No live connection available');
            return [];
        }
        try {
            const res = await this.client.query(query, params);
            return res.rows || [];
        } catch (error) {
            console.error('Error executing query with live connection:', error);
            return [];
        }
    }

    public async closePool(): Promise<void> {
        await this.pool.end();
        console.log('Connection pool closed');
    }
}

export { DBClient, DBConfig };
