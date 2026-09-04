import { Pool } from 'pg';

// Configure la connexion à la DB
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: true }
});