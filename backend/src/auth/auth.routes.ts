import { Router } from "express";
import bcrypt from 'bcrypt';
import { DatabaseError } from "pg";

import { normalizeEmail, isValidEmail, getPasswordErrors } from "./auth.validator";
import { pool } from "../config/db";

const MSG_EMAIL_ALREADY_USED = 'Cette adresse email est déjà utilisée';

export const authRoutes = Router();

authRoutes.post('/register', async(req, res) => {
    const { email, password } = req.body ?? {};

    // On vérifie le type des paramètres
    if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({
            errors: ['Les champs email et password sont requis']
        });
    }

    const normalizedEmail = normalizeEmail(email);
    const emailIsValid = isValidEmail(normalizedEmail);

    // Vérifie l'email
    if (!emailIsValid) {
        return res.status(400).json({
            "errors": [
                "Le format de l'email n'est pas valide"
            ] 
        });
    }

    // Vérifie le mot de passe
    const passwordErrors = getPasswordErrors(password);

    if (passwordErrors.length > 0) {
        return res.status(400).json({
            "errors": passwordErrors
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
    const passwordHash = await bcrypt.hash(password, 12);

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