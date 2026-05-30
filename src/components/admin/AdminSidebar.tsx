import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, HandCoins, ClipboardList, Building2, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const items = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard },
  { title: "Donations", url: "/admin/donations", icon: HandCoins },
  { title: "Applications", url: "/admin/applications", icon: ClipboardList },
  { title: "Sponsors", url: "/admin/sponsors", icon: Building2 },
];

export function AdminSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="px-6 py-8">
          <p className="font-serif text-lg tracking-tight">Admin</p>
          <p className="text-xs text-muted-foreground mt-1">Foundation Console</p>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <NavLink to={item.url} end className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
