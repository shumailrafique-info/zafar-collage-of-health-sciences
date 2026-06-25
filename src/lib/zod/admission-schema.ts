import { z } from "zod";
import { uploadedFileSchema } from "./uplaod-file.schema";

export const admissionFormSchema = z.object({
    fullName: z
        .string()
        .min(2, "Applicant name is required"),
    fatherOrGuardianName: z
        .string()
        .min(2, "Father/Guardian name is required"),
    motherName: z
        .string()
        .min(2, "Mother name is required"),
    gender: z.enum(["male", "female"], "Gender is required"),
    nationality: z
        .string()
        .min(2, "Nationality is required"),
    dateOfBirth: z.date("Date of birth is required"),
    provinceOfDomicile: z
        .string()
        .min(2, "Province of domicile is required"),
    cnicOrBFormNumber: z
        .string()
        .regex(
            /^\d{13}$/,
            "CNIC/B-Form must contain exactly 13 digits"
        ),
    address: z
        .string()
        .min(10, "Address is required"),
    qualification: z
        .string()
        .min(2, "Qualification is required"),
    age: z
        .number("Please enter valid age")
        .min(0)
        .max(100),
    cellNumber: z
        .string()
        .regex(
            /^(\+92|0)?3\d{9}$/,
            "Invalid Pakistani mobile number"
        ),
    image: z
        .array(uploadedFileSchema)
        .min(1, "image is required")
        .max(1, "only one image is allowed"),
});

export type AdmissionFormSchemaType = z.infer<typeof admissionFormSchema>;