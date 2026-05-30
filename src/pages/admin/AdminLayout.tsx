import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

export default function AdminLayout() {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <header className="h-14 flex items-center border-b px-4">
              <SidebarTrigger />
            </header>
            <main className="flex-1 p-8 lg:p-12">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
