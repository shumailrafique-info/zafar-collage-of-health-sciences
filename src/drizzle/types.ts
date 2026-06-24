import {
  user,
  userRoleEnum
} from "@/drizzle/schema";
import { InferSelectModel } from "drizzle-orm";
import { admissionForms } from "./schemas/admission-schema";

export type User = InferSelectModel<typeof user>;
export type UserRoleType = typeof userRoleEnum.enumValues[number];

export type AdmissionType = InferSelectModel<typeof admissionForms>;