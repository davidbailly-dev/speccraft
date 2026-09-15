import { rateLimit, MemoryStore } from 'express-rate-limit';

export const memoryStore = new MemoryStore();
export const RATE_LIMIT = 10;

const MSG_MAX_ATTEMPTS_REACHED = "Trop de tentatives de connexion, réessayez plus tard";

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: RATE_LIMIT,
    skipSuccessfulRequests: true,
    legacyHeaders: false,
    standardHeaders: 'draft-7',
    message: { errors: [MSG_MAX_ATTEMPTS_REACHED] },
    store: memoryStore
});