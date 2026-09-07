import type { ApiFetchInput } from "./types";

const url = process.env.NEXT_PUBLIC_BACKEND_HOST + ':' + process.env.NEXT_PUBLIC_BACKEND_PORT;

export async function apiFetch(request: ApiFetchInput) {
    const initialHeaders = { 'Content-Type': 'application/json' };
    const requestHeaders = request.headers ?? {};
    const mergedHeaders = {...initialHeaders, ...requestHeaders};

    const res = await fetch(url + request.endpoint, {
        method: request.method,
        credentials: 'include',
        headers: mergedHeaders,
        body: request.body,
    });

    return res;
}

// Permet de lire la réponse JSON du backend
// ou retourner null si le JSON est vide
export async function readJson<T>(res: Response): Promise<T | null> {
    try {
        return await res.json();
    } catch {
        return null;
    }
}