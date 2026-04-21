import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RoleGuard } from "@/components/RoleGuard";
import Dashboard from "./pages/Dashboard";
import Integrations from "./pages/Integrations";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import RunWorkflow from "./pages/RunWorkflow";
import RunDetail from "./pages/RunDetail";
import AutoPolling from "./pages/AutoPolling";
import ActivityPage from "./pages/Activity";
import MCPSetup from "./pages/MCPSetup";
import UsersPage from "./pages/Users";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public pages (no sidebar) */}
              <Route path="/landing" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/onboarding" element={<Onboarding />} />

              {/* App pages (with sidebar) */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route
                          path="/integrations"
                          element={
                            <RoleGuard allowed={["admin"]}>
                              <Integrations />
                            </RoleGuard>
                          }
                        />
                        <Route
                          path="/users"
                          element={
                            <RoleGuard allowed={["admin"]}>
                              <UsersPage />
                            </RoleGuard>
                          }
                        />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/projects/:projectId" element={<ProjectDetail />} />
                        <Route path="/projects/:projectId/run" element={<RunWorkflow />} />
                        <Route path="/projects/:projectId/autopoll" element={<AutoPolling />} />
                        <Route path="/runs/:runId" element={<RunDetail />} />
                        <Route path="/activity" element={<ActivityPage />} />
                        <Route path="/mcp" element={<MCPSetup />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

