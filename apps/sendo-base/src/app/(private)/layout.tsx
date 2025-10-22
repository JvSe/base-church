import { AppSidebar } from "@/src/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@base-church/ui/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden [--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex h-full flex-col">
        <div className="flex flex-1 overflow-hidden">
          <AppSidebar variant="inset" />

          <SidebarInset className="flex-1 overflow-hidden">
            <div className="flex flex-1 flex-col gap-4 overflow-hidden md:gap-6">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
