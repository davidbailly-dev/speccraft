import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { pool } from './db';

// Vérifie si SESSION_SECRET est défini
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
    throw new Error('SESSION_SECRET is not defined');
}

// Configure le store pg session
const pgSession = connectPgSimple(session);

const store = new pgSession({
    pool,
    tableName: 'session'
});

// Configure le middleware de session
export const sessionMiddleware = session({
    store,
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    },
})
