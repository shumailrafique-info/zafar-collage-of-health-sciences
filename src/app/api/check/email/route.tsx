import { db } from "@/drizzle/db";
import { user } from "@/drizzle/schema";
import { ApiResponse } from "@/lib/types/global";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
    email: z.string().trim().toLowerCase().email(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const parsed = bodySchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json<ApiResponse<null>>(
                {
                    success: false,
                    error: "Invalid email address",
                },
                { status: 400 }
            );
        }

        const existingUser = await db.query.user.findFirst({
            where: eq(user.email, parsed.data.email),
            columns: {
                id: true,
            },
        });

        return NextResponse.json<ApiResponse<{ exists: boolean }>>({
            success: true,
            data: {
                exists: !!existingUser,
            },
        });
    } catch {
        return NextResponse.json<ApiResponse<null>>(
            {
                success: false,
                error: "Something went wrong",
            },
            { status: 500 }
        );
    }
}