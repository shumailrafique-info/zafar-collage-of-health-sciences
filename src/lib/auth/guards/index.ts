import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "../server";

type AuthSession = NonNullable<
    Awaited<ReturnType<typeof auth.api.getSession>>
>;

type AuthGuardResult =
    | {
        session: AuthSession;
        response: null;
        json: null
    }
    | {
        session: null;
        response: NextResponse;
        json: {
            success: false;
            error: string;
        };
    };

export async function ensureAdminAccess(): Promise<AuthGuardResult> {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || session.user.role !== "admin") {
        return {
            session: null,
            response: NextResponse.json(
                {
                    success: false,
                    error: "Admin access required."
                },
                { status: 403 }
            ),
            json: {
                success: false,
                error: "Admin access required."
            }
        };
    }

    return { session, response: null, json: null };
}

export async function ensureAuthenticatedUser(): Promise<AuthGuardResult> {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session) {
        return {
            session: null,
            response: NextResponse.json(
                {
                    success: false,
                    error: "Login required."
                },
                { status: 401 }
            ),
            json: {
                success: false,
                error: "Login required."
            }
        };
    }

    return { session, response: null, json: null };
}
