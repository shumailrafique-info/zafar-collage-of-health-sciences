"use server"
import { db } from "@/drizzle/db";
import { admissionForms } from "@/drizzle/schema";
import { AdmissionType } from "@/drizzle/types";
import { ensureAdminAccess } from "@/lib/auth/guards";
import { ApiResponse } from "@/lib/types/global";
import { desc } from "drizzle-orm";


export async function getAdmissions(): Promise<ApiResponse<AdmissionType[]>> {
    try {
        // Ensure user is authenticated (admin only)
        const auth = await ensureAdminAccess();
        if (!auth.session) return auth.json;

        const allAdmissions = await db.query.admissionForms.findMany({
            orderBy: [desc(admissionForms.createdAt)],
        });

        return { success: true, data: allAdmissions };
    } catch (error) {
        console.error("Failed to fetch admissions:", error);
        return { success: false, error: "Failed to fetch admissions" };
    }
}