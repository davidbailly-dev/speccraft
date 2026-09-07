import { NextRequest, NextResponse } from "next/server";
import { cookieName } from "./libs/api/user";

export async function proxy(request: NextRequest) {
    const cookie = request.cookies.get(cookieName);

    if (request.nextUrl.pathname === '/auth/login' || request.nextUrl.pathname === '/auth/register') {
        if (!cookie) {
            return NextResponse.next();
        } else {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    if (request.nextUrl.pathname.split('/')[1] === 'dashboard') {
        if (!cookie) {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        } else {
            return NextResponse.next();
        }
    }
}

export const config = {
    matcher: ['/dashboard/:path*', '/auth/:path*'],
}