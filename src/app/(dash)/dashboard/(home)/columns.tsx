"use client";

import { AdmissionStatusDropdown } from "@/components/shared/admission-status-dropdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { AdmissionType } from "@/drizzle/types";
import { useDeleteAdmission } from "@/lib/tanstack-react-query/hooks/admin-admissions";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DownloadIcon, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
        accessorKey: "age",
        header: "Age",
        cell: ({ row }) => `${Number(row.original.age).toFixed(0)}`,
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
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ActionsCell admission={row.original} />,
        enableSorting: false,
        enableHiding: false,
    },
];


function ActionsCell({ admission }: { admission: AdmissionType }) {
    const deleteMutation = useDeleteAdmission();

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this admission record? This action cannot be undone.")) {
            deleteMutation.mutate(admission.id);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-fit rounded-sm">
                <DropdownMenuItem asChild className="rounded-sm">
                    <Link href={`/d/${admission.id}`} target="_blank">
                        Download PDF
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="rounded-sm" variant="destructive">
                    Delete Record
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
