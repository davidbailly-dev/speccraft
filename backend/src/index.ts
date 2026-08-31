import express from 'express';
import { Pool } from 'pg';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';

// Configure la connexion à la DB
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Configure le serveur Express
const app = express();
const port = process.env.PORT || 3000;

// Configure le store pg session
const pgSession = connectPgSimple(session);

const store = new pgSession({
    pool,
    tableName: 'session'
});

// Pour compatibilité Render
app.set('trust proxy', 1);

// Vérifie si SESSION_SECRET est défini
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
    throw new Error('SESSION_SERCRET is not defined');
}

// Configure le middleware de session
app.use(
    session({
        store,
        secret: sessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        },
    }),
);

// Vérifie que le serveur Express tourne
app.get('/', (req, res) => {
    res.send('Success !');
})

// Vérifie la connexion à la base de données
app.get('/health', async(req, res) => {
    try {
        await pool.query('SELECT 1');
        res.status(200).json({ status: 'ok' });
    } catch(error) {
        console.error('Health check failed:', error);
        res.status(503).json({ status: 'error' });
    }
})

// Lance le serveur Express
app.listen(port, () => {
    console.log(`SpecCraft backend is listening on port ${port}`)
})