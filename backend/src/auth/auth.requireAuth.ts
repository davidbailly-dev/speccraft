import { Request, Response, NextFunction } from "express";

const MSG_USER_NOT_AUTH = "Utilisateur non authentifié";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const useId = req.session.userId;

    if (!useId) {
        return res.status(401).json({
            errors: [MSG_USER_NOT_AUTH]
        });
    }

    next();
}