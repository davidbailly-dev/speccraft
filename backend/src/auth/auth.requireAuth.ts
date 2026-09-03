import { Request, Response, NextFunction } from "express";

export const MSG_USER_NOT_AUTH = "Utilisateur non authentifié";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({
            errors: [MSG_USER_NOT_AUTH]
        });
    }

    next();
}