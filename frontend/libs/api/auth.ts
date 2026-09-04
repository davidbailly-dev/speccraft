import { apiFetch, readJson } from './client';

import type { LoginInput, ApiErrorBody, LoginResult, LoginSuccessBody } from './types';

const MSG_SERVER_ERROR = 'Une erreur serveur est survenue, veuillez réessayer plus tard';

export async function login(credentials: LoginInput): Promise<LoginResult> {
    const res = await apiFetch({
        endpoint: '/auth/login',
        method: 'POST',
        body: JSON.stringify(credentials)
    });

    if (!res.ok) {
        const errorBody = await readJson<ApiErrorBody>(res);
        const errors = errorBody?.errors ?? [MSG_SERVER_ERROR];

        switch (res.status) {
            case 400:
            case 401:
                return { success: false, reason: 'invalid_credentials', errors };
            case 429:
                return { success: false, reason: 'rate_limited', errors };
            default:
                return { success: false, reason: 'server_error', errors };
        }
    }

    const data = await readJson<LoginSuccessBody>(res);

    if (!data) {
        return {
            success: false,
            reason: 'server_error',
            errors: [MSG_SERVER_ERROR]
        }
    }

    return {
        success: true,
        user: data.user
    };
}

export async function logout() {
    // A coder plus tard
}

export async function register() {
    // A coder plus tard
}