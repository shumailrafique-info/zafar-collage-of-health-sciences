"use client";

import { AdmissionStatusDropdown } from "@/components/shared/admission-status-dropdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { AdmissionType } from "@/drizzle/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DownloadIcon } from "lucide-react";
import Image from "next/image";

export const columns: ColumnDef<AdmissionType>[] = [
    {
        id: "image",
        header: "Photo",
        cell: ({ row }) => {
            const image = row.original.image;
            const fullName = row.original.fullName || "applicant";

            const handleDownload = () => {
                const downloadUrl = `/api/download-image?url=${encodeURIComponent(image.url)}&filename=${encodeURIComponent(fullName + '_photo.jpg')}`;
                window.open(downloadUrl, '_blank');
            };

            return (
                <div className="flex items-center gap-2">
                    {image?.url ? (
                        <Image
                            src={image.url}
                            alt={fullName}
                            width={50}
                            height={50}
                            className="aspect-square shrink-0 object-cover rounded-full"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200" />
                    )}
                    {image?.url && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={handleDownload}
                            title="Download photo"
                        >
                            <DownloadIcon className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false, // keep photo column always visible
    },
    {
        accessorKey: "fullName",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Full Name" />
        ),
    },
    {
        accessorKey: "fatherOrGuardianName",
        header: "Father/Guardian",
    },
    {
        accessorKey: "motherName",
        header: "Mother",
    },
    {
        accessorKey: "gender",
        header: "Gender",
        cell: ({ row }) => (
            <Badge variant={row.original.gender === "male" ? "default" : "secondary"}>
                {row.original.gender}
            </Badge>
        ),
    },
    {
        accessorKey: "nationality",
        header: "Nationality",
    },
    {
        accessorKey: "dateOfBirth",
        header: "Date of Birth",
        cell: ({ row }) =>
            row.original.dateOfBirth
                ? format(new Date(row.original.dateOfBirth), "PPP")
                : "N/A",
    },
    {
        accessorKey: "provinceOfDomicile",
        header: "Province",
    },
    {
        accessorKey: "cnicOrBFormNumber",
        header: "CNIC/B-Form",
    },
    {
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "qualification",
        header: "Qualification",
    },
    {
        accessorKey: "marksPercentage",
        header: "Marks %",
        cell: ({ row }) => `${row.original.marksPercentage}%`,
    },
    {
        accessorKey: "cellNumber",
        header: "Cell Number",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <AdmissionStatusDropdown
                admissionId={row.original.id}
                currentStatus={row.original.status || "pending"}
            />
        ),
        enableSorting: true, // can still sort by status
    },
    {
        accessorKey: "createdAt",
        header: "Submitted At",
        cell: ({ row }) =>
            row.original.createdAt
                ? format(new Date(row.original.createdAt), "PPP p")
                : "N/A",
    },
];