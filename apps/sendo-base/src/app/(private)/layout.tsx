import { AppSidebar } from "@/src/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@repo/ui/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        {/* <SiteHeader /> */}

        <div className="flex flex-1">
          <AppSidebar variant="inset" />

          <SidebarInset className="overflow-hidden">
            <div className="flex flex-1 flex-col gap-4 md:gap-6">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
