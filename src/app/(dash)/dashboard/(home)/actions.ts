"use server"
import { db } from "@/drizzle/db";
import { admissionForms } from "@/drizzle/schema";
import { AdmissionStatusType, AdmissionType } from "@/drizzle/types";
import { ensureAdminAccess } from "@/lib/auth/guards";
import { ApiResponse } from "@/lib/types/global";
import { desc, eq } from "drizzle-orm";

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

export async function updateAdmissionStatus(
    id: string,
    status: AdmissionStatusType
): Promise<ApiResponse<{ id: string; status: string }>> {
    try {
        const auth = await ensureAdminAccess();
        if (!auth.session) return auth.json;

        // Validate status
        const validStatuses = ["pending", "under_review", "interview_scheduled", "accepted", "rejected", "withdrawn"];
        if (!validStatuses.includes(status)) {
            return { success: false, error: "Invalid status" };
        }

        // Update
        await db
            .update(admissionForms)
            .set({ status })
            .where(eq(admissionForms.id, id));

        return { success: true, data: { id, status } };
    } catch (error) {
        console.error("Failed to update admission status:", error);
        return { success: false, error: "Failed to update status" };
    }
}

export async function deleteAdmission(id: string): Promise<ApiResponse<{ id: string }>> {
    try {
        const auth = await ensureAdminAccess();
        if (!auth.session) return auth.json;

        // Optional: check existence before delete
        await db.delete(admissionForms).where(eq(admissionForms.id, id));

        return { success: true, data: { id } };
    } catch (error) {
        console.error("Failed to delete admission:", error);
        return { success: false, error: "Failed to delete admission" };
    }
}