import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardAvatar } from "@/components/dashboard/DashboardAvatar";
import { DashboardBreadcrumb } from "@/components/dashboard/DashboardBreadcrumb";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-12 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <DashboardBreadcrumb />
          </div>
          <DashboardAvatar />
        </header>
        <main className="flex-1 p-2 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
