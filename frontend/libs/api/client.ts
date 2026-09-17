import type { ApiFetchInput } from "./types";

const url = process.env.BACKEND_URL;

export async function apiFetch(request: ApiFetchInput) {
    const initialHeaders = { 'Content-Type': 'application/json' };
    const requestHeaders = request.headers ?? {};
    const mergedHeaders = {...initialHeaders, ...requestHeaders};
    const isServerSideRequest = typeof window === 'undefined';
    let requestEndpoint = '/api' + request.endpoint;

    // Adapte le endpoint de la requête si son origine est server side
    if (isServerSideRequest) {
        if (!url) { throw new Error('Env variable BACKEND_URL not defined'); }
        requestEndpoint = url + request.endpoint;
    }

    const res = await fetch(requestEndpoint, {
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