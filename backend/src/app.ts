import express, { type ErrorRequestHandler } from 'express';
import cors from 'cors';

import { sessionMiddleware } from './config/session';
import { pool } from './config/db';
import { authRoutes } from './auth/auth.routes';

// Configure le serveur Express
export const app = express();

// Configure CORS
const corsOptions = {
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
};

app.use(cors(corsOptions));

// Pour compatibilité Render
app.set('trust proxy', 1);

app.use(express.json());

// Déclare le middleware de session
app.use(sessionMiddleware);

// Route qui vérifie si Express tourne bien
app.get('/', (req, res) => {
    res.send('Success !');
})

// Route qui vérifie la connexion à la DB
app.get('/health', async(req, res) => {
    try {
        await pool.query('SELECT 1');
        res.status(200).json({ status: 'ok' });
    } catch(error) {
        console.error('Health check failed:', error);
        res.status(503).json({ status: 'error' });
    }
})

app.use('/auth', authRoutes);

const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
    console.error(err);
    res.status(500).json({ errors: ['Une erreur interne est survenue'] });
};

app.use(errorHandler);