// lib/cookieHandler.ts
import { NextResponse } from "next/server";

interface CookieOptions {
    path?: string;
    maxAge?: number; // in seconds
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "lax" | "strict" | "none";
    expires?: Date;
}

class CookieHandler {
    // Get cookie
    async get(key: string): Promise<string | null> {
        if (typeof window !== "undefined") {
            const match = document.cookie.match(new RegExp(`(?:^|; )${key}=([^;]*)`));
            return match ? decodeURIComponent(match[1]) : null;
        } else {
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies();
            return cookieStore.get(key)?.value || null;
        }
    }

    // Check if cookie exists
    async has(key: string): Promise<boolean> {
        return (await this.get(key)) !== null;
    }

    // Client-side delete
    deleteClientCookie(key: string, options?: CookieOptions): void {
        if (typeof window !== "undefined") {
            const path = options?.path || "/";
            document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
        }
    }

    // Server-side delete
    deleteServerCookie(key: string, res: NextResponse, options?: CookieOptions): NextResponse {
        res.cookies.delete({ name: key, path: options?.path || "/" });
        return res;
    }

    // Client-side set
    setClientCookie(key: string, value: string, options?: CookieOptions): void {
        if (typeof window !== "undefined") {
            let cookieStr = `${key}=${encodeURIComponent(value)}; path=${options?.path || "/"}`;
            if (options?.maxAge) cookieStr += `; max-age=${options.maxAge}`;
            if (options?.expires) cookieStr += `; expires=${options.expires.toUTCString()}`;
            if (options?.secure) cookieStr += `; secure`;
            if (options?.httpOnly) cookieStr += `; HttpOnly`; // note: HttpOnly not respected on client
            if (options?.sameSite) cookieStr += `; samesite=${options.sameSite}`;
            document.cookie = cookieStr;
        }
    }

    // Server-side set
    setServerCookie(key: string, value: string, res: NextResponse, options?: CookieOptions): NextResponse {
        res.cookies.set(key, value, {
            path: options?.path || "/",
            httpOnly: options?.httpOnly ?? true,
            secure: options?.secure ?? true,
            sameSite: options?.sameSite ?? "lax",
            maxAge: options?.maxAge,
            expires: options?.expires,
        });
        return res;
    }

    // Get all cookies
    async getAll(): Promise<Record<string, string>> {
        if (typeof window !== "undefined") {
            return Object.fromEntries(
                document.cookie.split("; ").map((cookie) => {
                    const [k, ...v] = cookie.split("=");
                    return [k, decodeURIComponent(v.join("="))];
                })
            );
        } else {
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies();
            if (!cookieStore?.getAll) return {};
            const all = cookieStore.getAll();
            return Object.fromEntries(all.map((c: any) => [c.name, c.value]));
        }
    }
}

const cookie = new CookieHandler();
export default cookie;
