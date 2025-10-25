import { MobileHeader } from "@/src/components/mobile";
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
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        {/* Mobile Header */}
        <MobileHeader />

        <div className="flex flex-1">
          {/* Desktop Sidebar */}
          <AppSidebar variant="inset" className="hidden md:flex" />

          <SidebarInset className="overflow-hidden">
            {/* Mobile Spacer */}
            <div className="h-16 md:hidden" />

            <div className="flex flex-1 flex-col gap-4 sm:gap-6">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
