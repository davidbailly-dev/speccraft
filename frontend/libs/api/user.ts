import { cache } from "react";
import { cookies } from "next/headers";
import { apiFetch, readJson } from "./client";
import { User } from "./types";

export const cookieName = 'connect.sid';

// Met en cache la fonction pour éviter les appels réseaux inutiles
export const getCurrentUser = cache(async function getCurrentUser(): Promise<User | null> {
    const headersCookies = await cookies();
    const cookie = headersCookies.get(cookieName);

    if (!cookie || !cookie.value) {
        return null;
    }

    const formattedHeaders = {
        "Cookie": cookieName + "=" + cookie.value,
    }

    try {
        const res = await apiFetch({
            endpoint: '/auth/me',
            method: 'GET',
            headers: formattedHeaders,
        });

        if (!res.ok) {
            return null;
        }

        const user = await readJson<User>(res);

        if (!user) {
            return null;
        }

        return user;
    } catch (err) {
        console.error('Error in getCurrentUser(): ', err);

        return null;
    }
});