import { UploadedFile } from "@/components/shared/image-uploader";
import {
    date,
    jsonb,
    numeric,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", [
    "male",
    "female",
]);

export const admissionForms = pgTable("admission_forms", {
    id: uuid("id").defaultRandom().primaryKey(),

    fullName: varchar("full_name", { length: 255 }).notNull(),

    fatherOrGuardianName: varchar("father_or_guardian_name", { length: 255 }).notNull(),

    motherName: varchar("mother_name", { length: 255, }).notNull(),

    gender: genderEnum("gender").notNull(),

    nationality: varchar("nationality", { length: 100, }).notNull(),

    dateOfBirth: date("date_of_birth", { mode: "date", }).notNull(),

    provinceOfDomicile: varchar("province_of_domicile", { length: 100 }).notNull(),

    cnicOrBFormNumber: varchar("cnic_or_bform_number", { length: 13 }).notNull(),

    address: text("address").notNull(),

    qualification: varchar("qualification", { length: 255, }).notNull(),

    marksPercentage: numeric("marks_percentage", { precision: 5, scale: 2, }).notNull(),

    cellNumber: varchar("cell_number", { length: 20, }).notNull(),

    image: jsonb("image").$type<UploadedFile>().notNull(),

    createdAt: timestamp("created_at", { withTimezone: true, }).defaultNow().notNull(),

    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});