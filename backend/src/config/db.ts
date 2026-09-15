import { Pool } from 'pg';

// Configure la connexion à la DB
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ...(process.env.DATABASE_SSL === "true" && {
        ssl: { rejectUnauthorized: true },
    }),
});