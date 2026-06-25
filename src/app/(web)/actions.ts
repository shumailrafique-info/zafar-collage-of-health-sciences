"use server";

import { db } from "@/drizzle/db";
import { admissionForms } from "@/drizzle/schema";
import { ApiResponse } from "@/lib/types/global";
import { admissionFormSchema, AdmissionFormSchemaType } from "@/lib/zod/admission-schema";

export async function createAdmission(
    input: AdmissionFormSchemaType
): Promise<ApiResponse<{ id: string }>> {
    try {
        // Validate input
        const parsed = admissionFormSchema.safeParse(input);
        if (!parsed.success) {
            return {
                success: false,
                error: parsed.error.issues[0]?.message ?? "Invalid input",
            };
        }

        // Extract image (single file from array)
        const image = parsed.data.image[0] ?? null;


        // Insert into database
        const [newAdmission] = await db
            .insert(admissionForms)
            .values({
                fullName: parsed.data.fullName,
                fatherOrGuardianName: parsed.data.fatherOrGuardianName,
                motherName: parsed.data.motherName,
                gender: parsed.data.gender,
                nationality: parsed.data.nationality,
                dateOfBirth: parsed.data.dateOfBirth,
                provinceOfDomicile: parsed.data.provinceOfDomicile,
                cnicOrBFormNumber: parsed.data.cnicOrBFormNumber,
                address: parsed.data.address,
                qualification: parsed.data.qualification,
                age: String(parsed.data.age),
                cellNumber: parsed.data.cellNumber,
                image: image,
            })
            .returning({ id: admissionForms.id });

        return { success: true, data: { id: newAdmission.id } };
    } catch (error) {
        console.error("Failed to create admission:", error);
        return { success: false, error: "Failed to create admission" };
    }
}