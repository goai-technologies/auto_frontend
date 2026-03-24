import { Link } from "react-router-dom";
import { LayoutDashboard, Plug, FolderKanban, Activity, Terminal } from "lucide-react";

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

const mainNav = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Integrations", url: "/integrations", icon: Plug },
  { title: "Projects", url: "/projects", icon: FolderKanban },
  { title: "Activity", url: "/activity", icon: Activity },
  { title: "MCP Setup", url: "/mcp", icon: Terminal },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="none">
      <SidebarHeader className="py-3">
        <Link to="/landing" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
            <Terminal className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">GoAI</span>
            <span className="text-[10px] text-muted-foreground">Control Plane</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
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
            <span className="text-xs font-medium text-foreground">ABC Corp</span>
            <span className="text-[10px] text-muted-foreground">admin@abc.com</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

