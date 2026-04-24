import { Link } from "react-router-dom";
import { LayoutDashboard, Plug, FolderKanban, Activity, Terminal, Users } from "lucide-react";

import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/components/AuthProvider";
import type { Role } from "@/lib/api/types";

const mainNav: Array<{ title: string; url: string; icon: any; roles: Role[] }> = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, roles: ["admin", "operator"] },
  { title: "Integrations", url: "/integrations", icon: Plug, roles: ["admin"] },
  { title: "Users", url: "/users", icon: Users, roles: ["admin"] },
  { title: "Projects", url: "/projects", icon: FolderKanban, roles: ["admin", "operator"] },
  { title: "Activity", url: "/activity", icon: Activity, roles: ["admin", "operator"] },
  { title: "MCP Setup", url: "/mcp", icon: Terminal, roles: ["admin", "operator"] },
];

export function AppSidebar() {
  const { role, tenantId, userId } = useAuth();
  const visibleNav = mainNav.filter((item) => (role ? item.roles.includes(role) : true));

  return (
    <Sidebar collapsible="none">
      <SidebarHeader className="py-3">
        <Link to="/landing" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
            <Terminal className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">PRPilot</span>
            <span className="text-[10px] text-muted-foreground">Control Plane</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink
                    to={item.url}
                    end={item.url === "/"}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground transition-colors"
                    activeClassName="bg-accent text-primary font-medium"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-4 py-3">
        <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
          <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-[10px] font-bold text-primary">A</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-foreground">{tenantId ?? "Tenant"}</span>
            <span className="text-[10px] text-muted-foreground">{userId ?? role ?? "user"}</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

