import Loader from "@/components/ui/loader";
import { Suspense } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<Loader />}>
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </Suspense>
  );
}