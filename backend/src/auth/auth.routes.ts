import { Router } from "express";
import bcrypt from "bcrypt";
import { DatabaseError } from "pg";

import { normalizeEmail, isValidEmail, getPasswordErrors } from "./auth.validator";
import { pool } from "../config/db";
import { loginLimiter } from "./auth.rateLimit";
import { requireAuth, MSG_USER_NOT_AUTH } from "./auth.requireAuth";

// DUMMY_HASH placeholder = 'speccraft-project-rocks' / Cost = 12
const DUMMY_HASH = '$2b$12$OGdYeI1idJH9WUFQ0VnW1eF4v3o9ladk3/uVl1BxJ0X84bcDJo73C';
const BCRYPT_COST = 12;
const MSG_EMAIL_ALREADY_USED = "Cette adresse email est déjà utilisée";
const MSG_EMAIL_AND_PASSWORD_REQUIRED = "Les champs email et password sont requis";
const MSG_WRONG_EMAIL_OR_PASSWORD = "Email ou mot de passe invalide";

export const authRoutes = Router();

// Route d'inscription d'un nouvel utilisateur
authRoutes.post('/register', async(req, res) => {
    const { email, password } = req.body ?? {};

    // On vérifie le type de l'email et du mot de passe
    if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({
            errors: [MSG_EMAIL_AND_PASSWORD_REQUIRED]
        });
    }

    const normalizedEmail = normalizeEmail(email);
    const emailIsValid = isValidEmail(normalizedEmail);

    // Vérifie l'email
    if (!emailIsValid) {
        return res.status(400).json({
            errors: [
                "Le format de l'email n'est pas valide"
            ] 
        });
    }

    // Vérifie le mot de passe
    const passwordErrors = getPasswordErrors(password);

    if (passwordErrors.length > 0) {
        return res.status(400).json({
            errors: passwordErrors
        });
    }

    // Vérifie l'unicité de l'email
    const existingUser = await pool.query<{id: number}>(
        'SELECT id FROM users WHERE email = $1',
        [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
        return res.status(409).json({
            errors: [MSG_EMAIL_ALREADY_USED]
        });
    }

    // Créé l'utilisateur en DB
    const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

    try {
        const result = await pool.query<{ id: number; email: string }>(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
            [normalizedEmail, passwordHash]
        );

        const user = result.rows[0];

        return res.status(201).json({
            user: { id: user.id, email: user.email }
        });
    } catch (err) {
        if (err instanceof DatabaseError && err.code ==='23505') {
            return res.status(409).json({
                errors: [MSG_EMAIL_ALREADY_USED]
            });
        }

        throw err;
    }
});

// Route de login utilisateur existant
authRoutes.post('/login', loginLimiter, async(req, res) => {
    const { email, password } = req.body ?? {};

    // On vérifie le type de l'email et du mot de passe
    if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({
            errors: [MSG_EMAIL_AND_PASSWORD_REQUIRED]
        });
    }

    // Vérifie si l'email est connu en DB
    const normalizedEmail = normalizeEmail(email);

    const user = await pool.query<{id: number, email: string, password_hash: string}>(
        'SELECT id, email, password_hash FROM users WHERE email = $1',
        [normalizedEmail]
    );

    const userFound = user.rows.length > 0;

    // Email existant en DB, vérifie si le mot de passe correspond
    const hashToCompare = userFound ? user.rows[0].password_hash : DUMMY_HASH;
    const passwordIsValid = await bcrypt.compare(password, hashToCompare);

    if (!userFound || !passwordIsValid) {
        return res.status(401).json({
            errors: [MSG_WRONG_EMAIL_OR_PASSWORD]
        });
    }

    const id = user.rows[0].id;

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
    req.session.userId = id;

    // Email et mot de passe sont corrects
    return res.status(200).json({
        user: {
            id: id,
            email: user.rows[0].email,
        }
    });
});

// Route de déconnexion utilisateur
authRoutes.post('/logout', async(req, res) => {
    await new Promise<void>((resolve, reject) => {
        req.session.destroy(function(err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });

    // Indique au navigateur qu'il doit supprimer le cookie stocké
    res.clearCookie('connect.sid');

    // Toujours indiquer succès pour ne pas donner de détails sur la réponse
    return res.sendStatus(204);
});

// Route retournant les infos de l'utilisateur connecté
authRoutes.get('/me', requireAuth, async(req, res) => {
    const userId = req.session.userId;

    if (userId === undefined) {
        return res.status(401).json({
            errors: [MSG_USER_NOT_AUTH]
        });
    }

    const user = await pool.query<{ email: string }>(
        'SELECT email FROM users WHERE id = $1',
        [userId]
    );

    if (user.rows.length === 0) {
        // On détruit la session
        await new Promise<void>((resolve, reject) => {
            req.session.destroy(function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        // Indique au navigateur qu'il doit supprimer le cookie stocké
        res.clearCookie('connect.sid');

        return res.status(401).json({
            errors: [MSG_USER_NOT_AUTH]
        });
    }

    return res.status(200).json({
        user: {
            id: userId,
            email: user.rows[0].email,
        },
    });
});