import * as React from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun, LogOut } from "lucide-react";
import { getAuthToken, setAuthToken } from "@/lib/api";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate("/landing", { replace: true });
    }
  }, [navigate]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-10 flex h-12 items-center border-b border-border/40 bg-background/80 px-6 backdrop-blur-sm">
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  setAuthToken(null);
                  navigate("/landing", { replace: true });
                }}
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </header>
          <main className="flex-1 p-6 lg:p-8 overflow-auto">
            <div className="mx-auto flex h-full w-full max-w-6xl flex-col">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

