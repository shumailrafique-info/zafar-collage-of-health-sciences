"use client";

import { Button } from "@/components/ui/button";
import { AdmissionType } from "@/drizzle/types";
import Image from "next/image";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export default function AdmissionSheetPage({
    admissionRecord,
}: {
    admissionRecord: AdmissionType;
}) {
    const contentRef = useRef<HTMLDivElement>(null);

    const pdfTitle = `admission_form_${admissionRecord.fullName.replace(
        /[\\/:*?"<>|]/g,
        ""
    )}`;

    const handleDownload = useReactToPrint({
        contentRef,
        documentTitle: pdfTitle,
    });

    const dob = new Date(admissionRecord.dateOfBirth);

    const formattedDob = [
        String(dob.getDate()).padStart(2, "0"),
        String(dob.getMonth() + 1).padStart(2, "0"),
        String(dob.getFullYear())
    ]
        .join("")
        .split("");

    const dobLabels = ["d", "d", "m", "m", "y", "y", "y", "y"];

    const cnic = admissionRecord.cnicOrBFormNumber.split("");

    return (
        <>
            <div
                ref={contentRef}
                className="w-[210mm] min-h-[297mm] bg-white mx-auto border-4 border-black p-[5mm] text-black relative"
            >
                {/* Inner Border */}
                <div className="border-2 border-black h-full p-[5mm]">
                    {/* Header */}
                    <div className="flex items-start gap-4">
                        {/* Logo */}
                        <div className="w-[28mm] h-[28mm] border border-black rounded-lg overflow-hidden flex items-center justify-center text-[10px]">
                            <Image
                                src="/images/logo.jpeg"
                                alt="Zafar College of Health Science"
                                width={60}
                                height={60}
                                className="rounded-full w-full h-full border-2 border-white"
                                priority
                            />
                        </div>

                        {/* Header Content */}
                        <div className="flex-1 text-start">
                            <h1 className="text-[22pt] font-bold">
                                Zafer College Of Health Sciences
                            </h1>

                            <p className="text-[11pt] font-bold underline leading-none">
                                Near 231mor Dokota Road Adda Zakheera
                            </p>

                            <div className="inline-block border border-black px-4 py-1 mt-2 text-sm font-semibold">
                                Reg NO # F.No-2-197/2023-PCP
                            </div>
                        </div>
                    </div>

                    {/* Admission Badge */}
                    <div className="flex justify-center mt-4">
                        <div className="bg-black text-white px-6 py-2 rounded-md text-[12pt] font-bold shadow-md">
                            ADMISSION FORM
                        </div>
                    </div>

                    {/* Personal Info */}
                    <div className="mt-4 text-[11pt] font-bold">
                        Part 1-personal information
                    </div>

                    <div className="mt-1 space-y-2 text-[15px]">
                        {/* Name */}
                        <div className="flex items-start justify-between gap-5 w-full">
                            <div className="flex flex-col gap-2 w-full">
                                <Field
                                    label="1-Name of the applicant"
                                    value={admissionRecord.fullName}
                                />

                                {/* Father */}
                                <Field
                                    label="2- Father,s Guardian Name"
                                    value={admissionRecord.fatherOrGuardianName}
                                />

                                {/* Mother */}
                                <div className="flex gap-5">
                                    <div className="flex-1">
                                        <Field
                                            label="3- Mother’s Name"
                                            value={admissionRecord.motherName}
                                        />
                                    </div>
                                </div>

                            </div>
                            <div>
                                <div className="w-[38mm] aspect-3.5/4.5 border border-black relative">
                                    {admissionRecord.image?.url && (
                                        <Image
                                            src={admissionRecord.image.url}
                                            alt="student"
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Gender + Nationality */}
                        <div className="flex items-end gap-5">
                            <div>
                                <p className="font-medium">4-Gender :</p>
                                <div className="flex gap-4 mt-0.5">
                                    <CheckBox
                                        checked={
                                            admissionRecord.gender === "male"
                                        }
                                        label="M"
                                    />
                                    <CheckBox
                                        checked={
                                            admissionRecord.gender === "female"
                                        }
                                        label="F"
                                    />
                                </div>
                            </div>

                            <div className="flex-1">
                                <Field
                                    label="5- Nationality"
                                    value={admissionRecord.nationality}
                                />
                            </div>
                        </div>

                        {/* DOB + Province */}
                        <div className="flex gap-5">
                            <div>
                                <p className="font-medium">7-Date of Birth :</p>
                                <div className="flex gap-2 mt-0.5">
                                    {formattedDob.map((item, i) => (
                                        <div key={i} className="flex flex-col items-center">
                                            <Box>{item}</Box>
                                            <span className="text-xs mt-1">{dobLabels[i]}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1">
                                <Field
                                    label="8- Province of Domicile"
                                    value={admissionRecord.provinceOfDomicile}
                                />
                            </div>
                        </div>
                        {/* CNIC */}
                        <div>
                            <p className="font-medium">9-CNIC/B-form No.</p>
                            <div className="flex gap-1 mt-2">
                                {cnic.map((item, i) => (
                                    <Box key={i}>{item}</Box>
                                ))}
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <p className="font-medium">10-Address :</p>
                            <div className="border border-black min-h-[20mm] mt-0.5 p-2">
                                {admissionRecord.address}
                            </div>
                        </div>

                        {/* Qualification Row */}
                        <div className="grid grid-cols-3 gap-5">
                            <Field
                                label="11-Qualification"
                                value={admissionRecord.qualification}
                            />

                            <Field
                                label="Age"
                                value={String(Number(admissionRecord.age).toFixed(0))}
                            />

                            <Field
                                label="13-Cell No"
                                value={admissionRecord.cellNumber}
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="mt-2">
                        <h3 className="font-bold text-[22px]">Note:</h3>

                        <ul className="mt-1 pl-8 list-disc text-[11pt] font-semibold">
                            <li>
                                Examination, Registration & Verification Fee
                                Will be Charge as per University & Board Fee
                                once paid not be Refundable.
                            </li>
                            <li>
                                70% Dues Clear in 1st year & 30% dues clear in
                                2nd year.
                            </li>
                        </ul>
                    </div>

                    {/* Signatures */}
                    <div className="mt-5 flex justify-between">
                        <div className="text-center">
                            <p className="underline font-bold">
                                Principle Signature
                            </p>
                            <div className="w-[40mm] border-b border-black mt-14"></div>
                        </div>

                        <div className="text-center">
                            <p className="underline font-bold">
                                Parents Signature
                            </p>
                            <div className="w-[40mm] border-b border-black mt-14"></div>
                        </div>
                    </div>
                </div>
            </div>

            <Button
                onClick={handleDownload}
                className="fixed top-5 right-5 print:hidden"
            >
                Download PDF
            </Button>

            <style>{`
                @page {
                    size: A4;
                    margin: 0;
                }

                @media print {
                    html, body {
                        margin: 0;
                        padding: 0;
                    }

                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            `}</style>
        </>
    );
}

function Field({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div>
            <p className="mb-0.5 font-medium">{label} :</p>
            <div className="border border-black py-2 px-2 leading-none flex items-center justify-start text-[15px]">
                <p> {value}</p>
            </div>
        </div>
    );
}

function Box({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-[8mm] h-[8mm] border border-black flex items-center justify-center text-sm">
            {children}
        </div>
    );
}

function CheckBox({
    checked,
    label,
}: {
    checked: boolean;
    label: string;
}) {
    return (
        <div className="flex items-center gap-2">
            <div className="w-[8mm] h-[8mm] border border-black flex items-center justify-center">
                {checked && "✓"}
            </div>
            <span>{label}</span>
        </div>
    );
}