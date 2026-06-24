import { AppSidebar } from "@/app/(dash)/_components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar";
import { ensureAuthenticatedUser } from "@/lib/auth/guards";
import { redirect } from "next/navigation";
import DashboardTop from "../_components/dashboard-top";
import ProtectorUi from "../_components/protector-ui";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = await ensureAuthenticatedUser()

  if (!session) {
    redirect("/sign-in");
  }

  if (session && session.user.role !== "admin") {
    return (
      <ProtectorUi />
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardTop />
        <div className="grid w-full">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
