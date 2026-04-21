import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal, ArrowRight } from "lucide-react";
import { useOnboardingStatus } from "@/hooks/api/useOnboarding";
import { useAuth } from "@/components/AuthProvider";
import { OnboardingChecklist } from "@/components/onboarding/OnboardingChecklist";
import { OnboardingStatusBanner } from "@/components/onboarding/OnboardingStatusBanner";
import { OnboardingStepCard } from "@/components/onboarding/OnboardingStepCard";
import { PageState } from "@/components/common/PageState";

export default function Onboarding() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const statusQuery = useOnboardingStatus();
  const data = statusQuery.data;
  const steps = data
    ? [
        { label: "Admin account created", done: data.steps.admin_created },
        { label: "Integration connected", done: data.steps.integration_connected },
        { label: "Project configured", done: data.steps.project_created },
        { label: "First run ready", done: data.steps.first_run_ready },
      ]
    : [];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-1/4 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/8 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-lg">
        <div className="mb-6 flex justify-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Terminal className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight">GoAI</span>
          </div>
        </div>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Setup Progress</CardTitle>
            <CardDescription>Backend-driven onboarding status for your workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PageState
              loading={statusQuery.isLoading}
              error={statusQuery.isError ? "Failed to load onboarding status." : null}
              onRetry={() => statusQuery.refetch()}
            >
              <div className="space-y-4">
                <OnboardingStatusBanner complete={!!data?.is_complete} />
                <OnboardingChecklist steps={steps} />
                {(data?.missing_steps ?? []).map((item) => (
                  <OnboardingStepCard key={item} title="Missing step" description={item} />
                ))}
                <OnboardingStepCard
                  title="First Run Availability"
                  description={
                    data?.first_run_possible
                      ? "A first run can be triggered now."
                      : "First run is not possible yet. Complete required setup steps."
                  }
                />
                {!data?.is_complete && role === "admin" && (
                  <div className="flex gap-2">
                    <Button onClick={() => navigate("/integrations")}>Connect integrations</Button>
                    <Button variant="outline" onClick={() => navigate("/projects")}>
                      Create project
                    </Button>
                  </div>
                )}
                <Button onClick={() => navigate("/")}>
                  Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </PageState>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

