export function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 255;
}

export function getPasswordErrors(password: string): string[] {
    const errors: string[] = [];
    
    if (password.length < 8) {
        errors.push('Le mot de passe doit contenir au moins 8 caractères')
    }

    if (Buffer.byteLength(password, 'utf8') > 72) {
        errors.push('Le mot de passe ne doit pas dépasser 72 octets')
    }

    // On utilise les classes Unicode pour filtrer aussi les majuscules et minuscules avec accent
    if (!/\p{Lu}/u.test(password)) {
        errors.push('Le mot de passe doit contenir au moins une majuscule');
    }

    if (!/\p{Ll}/u.test(password)) {
        errors.push('Le mot de passe doit contenir au moins une minuscule');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Le mot de passe doit contenir au moins un chiffre');
    }

    if (!/[^\p{L}\p{N}]/u.test(password)) {
        errors.push('Le mot de passe doit contenir au moins un caractère spécial');
    }

    return errors;
}