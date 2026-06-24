"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger
} from "@/components/ui/select";
import { AdmissionStatusType } from "@/drizzle/types";
import { useUpdateAdmissionStatus } from "@/lib/tanstack-react-query/hooks/admin-admissions";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const statusConfig: Record<
    string,
    {
        variant: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
        label: string;
        className: string;
    }
> = {
    pending: {
        variant: "secondary",
        label: "Pending",
        className: "bg-gray-100 text-gray-800 border-gray-200",
    },
    under_review: {
        variant: "default",
        label: "Under Review",
        className: "bg-blue-100 text-blue-800 border-blue-200",
    },
    interview_scheduled: {
        variant: "outline",
        label: "Interview Scheduled",
        className: "bg-purple-100 text-purple-800 border-purple-300",
    },
    accepted: {
        variant: "default",
        label: "Accepted",
        className: "bg-green-600 text-white hover:bg-green-700 border-green-600",
    },
    rejected: {
        variant: "destructive",
        label: "Rejected",
        className: "bg-red-100 text-red-800 border-red-300",
    },
    withdrawn: {
        variant: "outline",
        label: "Withdrawn",
        className: "bg-gray-200 text-gray-700 border-gray-300",
    },
};

interface AdmissionStatusDropdownProps {
    admissionId: string;
    currentStatus: AdmissionStatusType;
}

export function AdmissionStatusDropdown({
    admissionId,
    currentStatus,
}: AdmissionStatusDropdownProps) {
    const [status, setStatus] = useState(currentStatus);
    const [open, setOpen] = useState(false);
    const { mutate, isPending } = useUpdateAdmissionStatus();

    const handleStatusChange = (newStatus: AdmissionStatusType) => {
        if (newStatus === status) return;
        setStatus(newStatus); // optimistic local update
        mutate(
            { id: admissionId, status: newStatus },
            {
                onError: () => {
                    // revert on error
                    setStatus(currentStatus);
                },
            }
        );
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
        <Select
            value={status}
            onValueChange={handleStatusChange}
            open={open}
            onOpenChange={setOpen}
            disabled={isPending}
        >
            <SelectTrigger className={cn("w-fit h-10 rounded-sm", config.className)}>
                <div className={cn("flex items-center gap-1",)}>
                    {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                    {config.label}
                </div>
            </SelectTrigger>
            <SelectContent className="rounded-sm">
                {Object.entries(statusConfig).map(([value, { label }]) => (
                    <SelectItem key={value} value={value} className="rounded-sm">
                        {label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}