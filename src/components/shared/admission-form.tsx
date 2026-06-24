"use client";

import { MultiImageUploader } from "@/components/shared/image-uploader";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AdmissionType } from "@/drizzle/types";
import { useCreateAdmission } from "@/lib/tanstack-react-query/hooks/admission";
import { admissionFormSchema, AdmissionFormSchemaType } from "@/lib/zod/admission-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Loader, UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";


type Props = {
    editingRow?: AdmissionType;
};

const AdmissionFormPage = ({ editingRow }: Props) => {
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { mutateAsync: createAdmission, isPending } = useCreateAdmission()
    const loading = isPending; // temporary

    const form = useForm<AdmissionFormSchemaType>({
        resolver: zodResolver(admissionFormSchema),
        defaultValues: {
            fullName: editingRow?.fullName ?? "",
            fatherOrGuardianName: editingRow?.fatherOrGuardianName ?? "",
            motherName: editingRow?.motherName ?? "",
            gender: editingRow?.gender ?? "male",
            nationality: editingRow?.nationality ?? "",
            dateOfBirth: editingRow?.dateOfBirth ? new Date(editingRow.dateOfBirth) : undefined,
            provinceOfDomicile: editingRow?.provinceOfDomicile ?? "",
            cnicOrBFormNumber: editingRow?.cnicOrBFormNumber ?? "",
            address: editingRow?.address ?? "",
            qualification: editingRow?.qualification ?? "",
            marksPercentage: editingRow?.marksPercentage ? Number(editingRow?.marksPercentage) : 0,
            cellNumber: editingRow?.cellNumber ?? "",
            image: editingRow?.image ? [editingRow.image] : [],
        },
    });

    const handleSave = async (data: AdmissionFormSchemaType) => {
        try {
            if (editingRow?.id) {
                console.log(data)
                toast.success("Admission record updated");
            } else {
                await createAdmission(data, {
                    onSuccess: () => {
                        toast.success("Admission submitted successfully!");
                        setIsSuccess(true);
                    },
                    onError: (err) => {
                        toast.error(err.message || "Something went wrong");
                    },
                });
            }
        } catch {
            toast.error("Something went wrong");
        }
    };

    useEffect(() => {
        if (editingRow) {
            form.reset({
                fullName: editingRow.fullName,
                fatherOrGuardianName: editingRow.fatherOrGuardianName,
                motherName: editingRow.motherName,
                gender: editingRow.gender,
                nationality: editingRow.nationality,
                dateOfBirth: editingRow.dateOfBirth ? new Date(editingRow.dateOfBirth) : undefined,
                provinceOfDomicile: editingRow.provinceOfDomicile,
                cnicOrBFormNumber: editingRow.cnicOrBFormNumber,
                address: editingRow.address,
                qualification: editingRow.qualification,
                marksPercentage: Number(editingRow.marksPercentage),
                cellNumber: editingRow.cellNumber,
                image: editingRow.image ? [editingRow.image] : [],
            });
        } else {
            form.reset({
                fullName: "",
                fatherOrGuardianName: "",
                motherName: "",
                gender: "male",
                nationality: "",
                dateOfBirth: undefined,
                provinceOfDomicile: "",
                cnicOrBFormNumber: "",
                address: "",
                qualification: "",
                marksPercentage: 0,
                cellNumber: "",
                image: [],
            });
        }
    }, [editingRow, form]);

    if (isSuccess) {
        return <div className="flex items-center justify-center min-h-[80dvh]"><SuccessScreen applicantName={form.getValues("fullName")} /></div>;
    }

    return (
        < >
            <div className="w-full">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        {editingRow ? "Admission Form" : "Admission Form"}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Fill in the details below to {editingRow ? "update" : "create"} an admission record.
                    </p>
                </div>

                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(handleSave)} className="space-y-3">
                        {/* Image */}
                        <Controller
                            name="image"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="gap-1!">
                                    <FieldLabel>
                                        Applicant Photo <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <MultiImageUploader
                                        value={field.value ?? []}
                                        onChange={field.onChange}
                                        maxFiles={1}
                                        className="w-full max-w-40 border border-gray-200 rounded-md"
                                        triggerClassName="w-full max-w-40 rounded-md"
                                        PreviewItemClassName="aspect-square! rounded-md"
                                        onUploadingChange={setIsUploadingImage}
                                        showLimit={false}
                                    >
                                        <div className="aspect-square cursor-pointer w-full flex items-center justify-center flex-col bg-gray-50 rounded-md border border-gray-200">
                                            <UploadCloud className="text-gray-400" />
                                            <div className="text-center text-xs mt-0.5 text-gray-500">512×512</div>
                                        </div>
                                    </MultiImageUploader>
                                    <p className="text-xs mt-2 text-gray-500">Upload a recent passport-size photograph.</p>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-red-500 text-xs" />}
                                </Field>
                            )}
                        />

                        {/* Full Name */}
                        <Controller
                            name="fullName"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field className="gap-1">
                                    <FieldLabel>
                                        Full Name <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Input {...field} placeholder="e.g. Muhammad Ali" className="border-gray-300 focus:border-green-500 focus:ring-green-500 h-10 rounded-sm!" />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        {/* Father / Guardian Name */}
                        <Controller
                            name="fatherOrGuardianName"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field className="gap-1">
                                    <FieldLabel>
                                        Father / Guardian Name <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Input {...field} placeholder="e.g. Ahmed Khan" className="border-gray-300 focus:border-green-500 focus:ring-green-500 h-10 rounded-sm!" />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        {/* Mother Name */}
                        <Controller
                            name="motherName"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field className="gap-1">
                                    <FieldLabel>
                                        Mother Name <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Input {...field} placeholder="e.g. Fatima Ahmed" className="border-gray-300 focus:border-green-500 focus:ring-green-500 h-10 rounded-sm!" />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        {/* Gender */}
                        <Controller
                            name="gender"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field className="gap-1">
                                    <FieldLabel>
                                        Gender <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="border-gray-300 focus:ring-green-500 h-10 rounded-sm!">
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-sm!">
                                            <SelectItem value="male" className="rounded-sm!">Male</SelectItem>
                                            <SelectItem value="female" className="rounded-sm!">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        {/* Nationality */}
                        <Controller
                            name="nationality"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field className="gap-1">
                                    <FieldLabel>
                                        Nationality <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Input {...field} placeholder="e.g. Pakistani" className="border-gray-300 focus:border-green-500 focus:ring-green-500 h-10 rounded-sm!" />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        {/* Date of Birth */}
                        <Controller
                            name="dateOfBirth"
                            control={form.control}
                            render={({ field, fieldState }) => {
                                const value = field.value ? new Date(field.value).toISOString().split('T')[0] : "";
                                return (
                                    <Field className="gap-1">
                                        <FieldLabel>
                                            Date of Birth <span className="text-red-500">*</span>
                                        </FieldLabel>
                                        <Input
                                            type="date"
                                            value={value}
                                            onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                                            className="border-gray-300 focus:border-green-500 focus:ring-green-500 h-10 rounded-sm!"
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                );
                            }}
                        />

                        {/* Province of Domicile */}
                        <Controller
                            name="provinceOfDomicile"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field className="gap-1">
                                    <FieldLabel>
                                        Province of Domicile <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Input {...field} placeholder="e.g. Punjab" className="border-gray-300 focus:border-green-500 focus:ring-green-500 h-10 rounded-sm!" />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        {/* CNIC / B-Form Number */}
                        <Controller
                            name="cnicOrBFormNumber"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field className="gap-1">
                                    <FieldLabel>
                                        CNIC / B-Form Number <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Input {...field} placeholder="13 digits e.g. 1234567890123" className="border-gray-300 focus:border-green-500 focus:ring-green-500 h-10 rounded-sm!" />
                                    <p className="text-xs text-gray-500 mt-1">Enter exactly 13 digits without dashes.</p>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        {/* Address */}
                        <Controller
                            name="address"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field className="gap-1">
                                    <FieldLabel>
                                        Address <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Textarea {...field} rows={2} placeholder="Permanent address..." className="border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-sm" />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        {/* Qualification */}
                        <Controller
                            name="qualification"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field className="gap-1">
                                    <FieldLabel>
                                        Qualification <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Input {...field} placeholder="e.g. F.Sc. Pre-Medical" className="border-gray-300 focus:border-green-500 focus:ring-green-500 h-10 rounded-sm!" />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        {/* Marks Percentage */}
                        <Controller
                            name="marksPercentage"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field className="gap-1">
                                    <FieldLabel>
                                        Marks Percentage <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.value === ""
                                                    ? ""
                                                    : parseFloat(e.target.value)
                                            )
                                        }
                                        placeholder="e.g. 85.50"
                                        className="border-gray-300 focus:border-green-500 focus:ring-green-500 h-10 rounded-sm!"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        {/* Cell Number */}
                        <Controller
                            name="cellNumber"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field className="gap-1">
                                    <FieldLabel>
                                        Cell Number <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Input {...field} placeholder="e.g. 03123456789" className="border-gray-300 focus:border-green-500 focus:ring-green-500 h-10 rounded-sm!" />
                                    <p className="text-xs text-gray-500 mt-1">Pakistani mobile number (03XXXXXXXXX or +923XXXXXXXXX).</p>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        {/* Form Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={loading || isUploadingImage}
                                className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                            >
                                {loading && <Loader className="animate-spin h-4 w-4 mr-2" />}
                                {editingRow ? "Update Admission" : "Submit"}
                            </button>
                        </div>
                    </form>
                </FormProvider>
            </div>
            <NotesSection />
        </>

    );
};

export default AdmissionFormPage;


function NotesSection() {
    return (
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4  rounded-md shadow-sm mt-5">
            <h2 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                <span>📋</span> Important Notes
            </h2>
            <ul className="list-disc list-outside pl-5 text-sm text-gray-700 mt-2 space-y-1">
                <li>Please fill all required fields marked with <span className="text-red-500">*</span>.</li>
                <li>Ensure your CNIC/B-Form number is exactly <strong>13 digits</strong>.</li>
                <li>Upload a recent <strong>passport-size photograph</strong> (square image works best).</li>
                <li>Double‑check your contact number before submission.</li>
                <li>For any queries, contact the admissions office.</li>
                <li>Examination, Registration & Verification Fee will be charged as per University & Board fee. Once paid, it is non-refundable.</li>
                <li>70% dues must be cleared in the 1st year and the remaining 30% dues must be cleared in the 2nd year.</li>
            </ul>
        </div>
    );
}

// Success Screen Component (defined outside)
function SuccessScreen({ applicantName }: { applicantName: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-green-100 rounded-full p-4 mb-6">
                <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
            <p className="text-lg text-gray-600 mb-1">
                Thank you, <span className="font-semibold">{applicantName || "Applicant"}</span>.
            </p>
            <p className="text-sm text-gray-500 mb-6">
                Your admission form has been received. We will contact you shortly.
            </p>

        </div>
    );
}