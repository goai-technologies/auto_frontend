import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Terminal, CheckCircle2, ArrowRight, ArrowLeft, Github, TicketCheck, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "GitHub", icon: Github },
  { label: "Issue Tracker", icon: TicketCheck },
  { label: "Done", icon: CheckCircle2 },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [githubToken, setGithubToken] = useState("");
  const [issueTracker, setIssueTracker] = useState<"jira" | "linear" | null>(null);
  const [jiraBaseUrl, setJiraBaseUrl] = useState("");
  const [jiraEmail, setJiraEmail] = useState("");
  const [jiraToken, setJiraToken] = useState("");
  const [linearKey, setLinearKey] = useState("");

  const canProceed = () => {
    if (step === 0) return githubToken.length > 0;
    if (step === 1) {
      if (issueTracker === "jira") return jiraBaseUrl && jiraEmail && jiraToken;
      if (issueTracker === "linear") return linearKey.length > 0;
      return false;
    }
    return true;
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
  };
  const prev = () => {
    if (step > 0) setStep(step - 1);
  };
  const finish = () => navigate("/");

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

        <div className="mb-8 flex items-center justify-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                  i < step
                    ? "border-primary bg-primary text-primary-foreground"
                    : i === step
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-muted text-muted-foreground",
                )}
              >
                {i < step ? <CheckCircle2 className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn("h-px w-10 transition-colors", i < step ? "bg-primary" : "bg-border")} />
              )}
            </div>
          ))}
        </div>

        <Card className="border-border bg-card">
          {step === 0 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="h-5 w-5" /> Connect GitHub
                </CardTitle>
                <CardDescription>
                  Add a Personal Access Token so GoAI can read repos and create PRs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gh-token">GitHub Personal Access Token</Label>
                  <Textarea
                    id="gh-token"
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="font-mono text-sm"
                    rows={3}
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Needs <code className="rounded bg-muted px-1 py-0.5 text-[11px]">repo</code> and{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-[11px]">workflow</code> scopes.
                  </p>
                </div>
              </CardContent>
            </>
          )}

          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TicketCheck className="h-5 w-5" /> Connect Issue Tracker
                </CardTitle>
                <CardDescription>Choose Jira or Linear and add your credentials.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIssueTracker("jira")}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors",
                      issueTracker === "jira"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/30",
                    )}
                  >
                    <Layers className="h-6 w-6 text-info" />
                    <span className="text-sm font-medium">Jira</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIssueTracker("linear")}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors",
                      issueTracker === "linear"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/30",
                    )}
                  >
                    <Layers className="h-6 w-6 text-foreground" />
                    <span className="text-sm font-medium">Linear</span>
                  </button>
                </div>

                {issueTracker === "jira" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Jira Base URL</Label>
                      <Input
                        placeholder="https://yourcompany.atlassian.net"
                        value={jiraBaseUrl}
                        onChange={(e) => setJiraBaseUrl(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        placeholder="you@company.com"
                        value={jiraEmail}
                        onChange={(e) => setJiraEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>API Token</Label>
                      <Input
                        type="password"
                        placeholder="Jira API token"
                        value={jiraToken}
                        onChange={(e) => setJiraToken(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {issueTracker === "linear" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Linear API Key</Label>
                      <Input
                        type="password"
                        placeholder="lin_api_xxxxxxxxxxxx"
                        value={linearKey}
                        onChange={(e) => setLinearKey(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>You're All Set!</CardTitle>
                <CardDescription>
                  Your integrations are configured. You can now create projects and start running workflows.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg border border-border bg-muted/50 p-4">
                  <h4 className="mb-2 text-sm font-semibold">What's next?</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      Create your first project linking a repo to a ticket source
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      Paste a ticket link and run a workflow to generate a PR
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      Set up auto-polling to continuously process tickets
                    </li>
                  </ul>
                </div>
              </CardContent>
            </>
          )}

          <div className="flex items-center justify-between border-t border-border px-6 py-4">
            <Button
              variant="ghost"
              onClick={prev}
              disabled={step === 0}
              className={cn(step === 0 && "invisible")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={next} disabled={!canProceed()}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={finish}>
                Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
          {step < 2 && (
            <div className="pb-4 text-center">
              <button
                onClick={() => setStep(2)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip for now — I'll set up later
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

