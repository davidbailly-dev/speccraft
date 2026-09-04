//
// API interfaces
//

export interface ApiFetchInput {
    endpoint: string,
    method: string,
    body: string,
}

export interface ApiErrorBody {
    errors: string[],
}

//
// Entities interfaces
//

export interface User {
    id: number,
    email: string,
}

//
// Auth interfaces & types
//

export interface LoginInput {
    email: string,
    password: string,
}

export interface LoginSuccessBody {
    user: User,
}

export type LoginResult =
    | { success: true, user: User }
    | { success: false, reason: null | 'invalid_credentials' | 'rate_limited' | 'server_error' , errors: string[] };