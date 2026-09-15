import { Request } from "express";

export async function createSession(req: Request, userId: number) {
    // Régénère l'identifiant de session : un identifiant obtenu avant la connexion
    // ne doit pas rester valide après, sinon un attaquant qui l'a fait adopter à sa
    // victime se retrouve dans son compte (fixation de session).
    // Doit impérativement précéder l'affectation ci-dessous, que regenerate effacerait.
    await new Promise<void>((resolve, reject) => {
        req.session.regenerate((err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });

    // Définit le userId de la session utilisateur
    // ce qui déclenche la création de la session via le middleware 'express-session'
    req.session.userId = userId;
}