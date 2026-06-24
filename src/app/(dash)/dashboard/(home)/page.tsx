"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/ui/loader";
import { AdmissionType } from "@/drizzle/types";
import { useAdmissions } from "@/lib/tanstack-react-query/hooks/admin-admissions";
import { AlertCircle, Award, MapPin, UserCheck, Users, UserX } from "lucide-react";
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

  const stats = computeStats(admissions || []);

  return (
    <div className="w-full grid p-5">
      <h1 className="text-2xl font-bold">All Admissions</h1>
      <div className="grid grid-cols-1 mt-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Admissions"
          value={stats.total}
          icon={<Users className="h-5 w-5 text-blue-600" />}
          description="Total submitted forms"
        />
        <StatCard
          title="Male / Female"
          value={`${stats.male} / ${stats.female}`}
          icon={<div className="flex gap-1"><UserCheck className="h-5 w-5 text-blue-600" /><UserX className="h-5 w-5 text-pink-600" /></div>}
          description="Gender distribution"
        />
        <StatCard
          title="Average Marks"
          value={`${stats.avgMarks}%`}
          icon={<Award className="h-5 w-5 text-yellow-600" />}
          description={`From ${stats.total} applicants`}
        />
        <StatCard
          title="Top Province"
          value={stats.topProvince || "N/A"}
          icon={<MapPin className="h-5 w-5 text-green-600" />}
          description={`${stats.topProvinceCount} applicants`}
        />
      </div>

      <div className="grid  w-full">
        <DataTable
          columns={columns}
          data={admissions || []}
        />
      </div>
    </div>
  );
}


function StatCard({ title, value, icon, description }: { title: string; value: string | number; icon: React.ReactNode; description: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

// Stats computation function
function computeStats(admissions: AdmissionType[]) {
  const total = admissions.length;
  const male = admissions.filter((a) => a.gender === "male").length;
  const female = total - male;

  // Average marks percentage (convert to number if string)
  const marks = admissions
    .map((a) => Number(a.marksPercentage))
    .filter((m) => !isNaN(m) && m >= 0 && m <= 100);
  const avgMarks = marks.length > 0 ? (marks.reduce((sum, m) => sum + m, 0) / marks.length).toFixed(1) : "N/A";

  // Province distribution
  const provinceCounts: Record<string, number> = {};
  admissions.forEach((a) => {
    const province = a.provinceOfDomicile || "Unknown";
    provinceCounts[province] = (provinceCounts[province] || 0) + 1;
  });
  const sortedProvinces = Object.entries(provinceCounts).sort((a, b) => b[1] - a[1]);
  const topProvince = sortedProvinces.length > 0 ? sortedProvinces[0][0] : null;
  const topProvinceCount = sortedProvinces.length > 0 ? sortedProvinces[0][1] : 0;

  return {
    total,
    male,
    female,
    avgMarks,
    topProvince,
    topProvinceCount,
  };
}