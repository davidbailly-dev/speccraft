import { normalizeEmail, isValidEmail, getPasswordErrors } from './auth.validator';

describe('normalizeEmail', () => {
    it('supprime les espaces et passe en minuscules', () => {
        expect(normalizeEmail('  Test.User@Example.COM  ')).toBe('test.user@example.com');
    });

    it('laisse inchangé un email déjà normalisé', () => {
        expect(normalizeEmail('test@example.com')).toBe('test@example.com');
    });
});

describe('isValidEmail', () => {
    it.each([
        'test@example.com',
        'prenom.nom@sous-domaine.example.fr',
    ])('accepte %s', (email) => {
        expect(isValidEmail(email)).toBe(true);
    });

    it.each([
        ['pas-un-email', 'sans arobase'],
        ['test@example', 'sans point dans le domaine'],
        ['test @example.com', 'avec un espace'],
        ['', 'vide'],
    ])('rejette %s (%s)', (email) => {
        expect(isValidEmail(email)).toBe(false);
    });

    it('rejette un email de plus de 255 caractères', () => {
        expect(isValidEmail('a'.repeat(250) + '@example.com')).toBe(false);
    });
});

describe('getPasswordErrors', () => {
    it.each([
        ['Motdepasse1!', 'cas nominal'],
        ['Éléphant2!', 'majuscule accentuée'],
        ['MonMot-de-passe1', 'tiret comme caractère spécial'],
    ])('accepte %s (%s)', (password) => {
        expect(getPasswordErrors(password)).toEqual([]);
    });

    it.each([
        ['Mdp1!', 'Le mot de passe doit contenir au moins 8 caractères'],
        ['🔐'.repeat(30) + 'aA1!', 'Le mot de passe ne doit pas dépasser 72 octets'],
        ['motdepasse1!', 'Le mot de passe doit contenir au moins une majuscule'],
        ['MOTDEPASSE1!', 'Le mot de passe doit contenir au moins une minuscule'],
        ['Motdepasse!', 'Le mot de passe doit contenir au moins un chiffre'],
        ['Motdepasse1', 'Le mot de passe doit contenir au moins un caractère spécial'],
    ])('rejette %s', (password, messageAttendu) => {
        expect(getPasswordErrors(password)).toContain(messageAttendu);
    });

    it('cumule les erreurs plutôt que de s\'arrêter à la première', () => {
        expect(getPasswordErrors('abc')).toHaveLength(4);
    });
});