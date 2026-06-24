"use client";

import Loader from "@/components/ui/loader";
import { useAdmissions } from "@/lib/tanstack-react-query/hooks/admin-admissions";
import { AlertCircle } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function AdmissionsPage() {
  const { data: admissions, isLoading, error } = useAdmissions();

  if (isLoading) {
    return <Loader className="min-h-100" />
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 flex items-center gap-3 text-destructive">
        <AlertCircle className="h-5 w-5" />
        <span>Failed to load admissions: {error.message}</span>
      </div>
    );
  }

  return (
    <div className="w-full grid p-5">
      <h1 className="text-2xl font-bold">All Admissions</h1>
      <div className="grid  w-full">
        <DataTable
          columns={columns}
          data={admissions || []}
        />
      </div>
    </div>
  );
}