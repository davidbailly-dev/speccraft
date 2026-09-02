import { rateLimit } from "express-rate-limit";

const MSG_MAX_ATTEMPTS_REACHED = "Trop de tentatives de connexion, réessayez plus tard";

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true,
    legacyHeaders: false,
    standardHeaders: 'draft-7',
    message: { errors: [MSG_MAX_ATTEMPTS_REACHED] },
});