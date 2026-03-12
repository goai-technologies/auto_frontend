import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/components/ThemeProvider";
import {
  ArrowRight,
  GitPullRequest,
  Zap,
  Shield,
  Bot,
  Plug,
  BarChart3,
  Terminal,
  CheckCircle2,
  Moon,
  Sun,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const features = [
  {
    icon: GitPullRequest,
    title: "Ticket → PR in Minutes",
    description:
      "Paste a Jira or Linear ticket and get a production-ready pull request with implementation, tests, and QA checks in under 5 minutes.",
  },
  {
    icon: Zap,
    title: "Auto-Polling Workflows",
    description:
      "Configure JQL or Linear filters and let GoAI continuously pick up new tickets, keep state, and generate fresh PRs as the queue moves.",
  },
  {
    icon: Bot,
    title: "Cursor MCP Integration",
    description:
      "Use GoAI directly from Cursor. Ask in natural language, run workflows, and inspect logs without leaving your IDE.",
  },
  {
    icon: Plug,
    title: "Connect Your Stack",
    description:
      "Integrate GitHub, Jira, and Linear with scoped tokens or installations. No custom scripts or webhooks required to start.",
  },
  {
    icon: Shield,
    title: "Multi-Tenant & Secure",
    description:
      "Each organization has isolated data, per-tenant credentials, and role-based access so GoAI can be safely adopted across teams.",
  },
  {
    icon: BarChart3,
    title: "Full Run Visibility",
    description:
      "See every step in the workflow—from PRD Lite to repo navigation, planning, implementation, and QA—with timestamps and structured logs.",
  },
];

const steps = [
  {
    step: "01",
    title: "Connect Your Tools",
    description: "Link your GitHub repo, Jira or Linear workspace with API tokens during onboarding.",
  },
  {
    step: "02",
    title: "Create a Project",
    description: "Map a code repository to a ticket source and select your default workflow.",
  },
  {
    step: "03",
    title: "Run or Auto-Poll",
    description: "Paste a ticket link for a one-off run, or configure auto-polling to process tickets continuously.",
  },
  {
    step: "04",
    title: "Review & Merge",
    description:
      "GoAI generates a PR with implementation, tests, and QA. Review it and merge.",
  },
];

export default function Landing() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Terminal className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">GoAI</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              How It Works
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/register">
                Get Started <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
              <Zap className="h-3 w-3" /> AI-Powered Development Workflows
            </span>
          </motion.div>
          <motion.h1
            className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
          >
            Turn Tickets Into
            <br />
            <span className="text-primary">Pull Requests</span>
            <br />
            Automatically
          </motion.h1>
          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
          >
            GoAI turns Jira or Linear tickets into reviewed pull requests in under{" "}
            <span className="font-semibold text-foreground">5 minutes</span> — including PRD, plan, implementation,
            and QA checks.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
          >
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <Link to="/register">
                Start Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </motion.div>

          <motion.div
            className="mx-auto mt-16 max-w-3xl"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
          >
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-primary/5">
              <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-warning/60" />
                <div className="h-3 w-3 rounded-full bg-success/60" />
                <span className="ml-2 font-mono text-xs text-muted-foreground">goai-workflow</span>
              </div>
              <div className="space-y-2 p-6 text-left font-mono text-sm leading-relaxed">
                <p className="text-muted-foreground">
                  <span className="text-primary">▶</span> [09:15:00] Processing ticket{" "}
                  <span className="text-info">PAY-142</span>
                </p>
                <p className="text-muted-foreground">
                  <span className="text-success">✓</span> [09:15:15] PRD Lite generated
                </p>
                <p className="text-muted-foreground">
                  <span className="text-success">✓</span> [09:15:45] Repo navigation complete — 12 files mapped
                </p>
                <p className="text-muted-foreground">
                  <span className="text-success">✓</span> [09:16:20] Implementation plan ready
                </p>
                <p className="text-muted-foreground">
                  <span className="text-success">✓</span> [09:17:30] Code written — 3 files changed
                </p>
                <p className="text-muted-foreground">
                  <span className="text-success">✓</span> [09:17:50] QA checks passed
                </p>
                <p className="text-foreground font-medium">
                  <span className="text-primary">✓</span> [09:18:30] PR created →{" "}
                  <span className="text-primary underline">github.com/acme/payments/pull/87</span>
                </p>
                <p className="pt-2 text-xs text-muted-foreground">
                  Elapsed: <span className="font-semibold text-foreground">3m 30s</span> from ticket to PR.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="border-t border-border bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ship production PRs in minutes, not days
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              From one-off ticket runs to fully automated pipelines — GoAI handles PRD, planning, implementation, and
              QA so your team can focus on reviews instead of boilerplate.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
              >
                <Card className="h-full border-border bg-card transition-colors hover:border-primary/30">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-t border-border py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Go from a single ticket link to a production-ready pull request through a predictable, explainable pipeline.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-4xl gap-8 sm:grid-cols-2">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                className="relative flex gap-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 font-mono text-lg font-bold text-primary">
                  {s.step}
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-semibold">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                  {s.step === "01" && (
                    <ul className="mt-2 list-disc pl-4 text-xs text-muted-foreground">
                      <li>OAuth / API tokens for GitHub, Jira, and Linear.</li>
                      <li>Per-tenant credentials stored in a secure vault.</li>
                      <li>Health checks to verify each integration before running.</li>
                    </ul>
                  )}
                  {s.step === "02" && (
                    <ul className="mt-2 list-disc pl-4 text-xs text-muted-foreground">
                      <li>Map repository, branch, and ticket project (e.g. PAY, USR).</li>
                      <li>Select the default workflow (Jira → PR, Linear → PR, etc.).</li>
                      <li>Define guardrails such as max files to touch or code areas to avoid.</li>
                    </ul>
                  )}
                  {s.step === "03" && (
                    <ul className="mt-2 list-disc pl-4 text-xs text-muted-foreground">
                      <li>One-off mode: paste a ticket; GoAI runs once and opens a PR.</li>
                      <li>Auto-poll mode: watch for new tickets that match your filters.</li>
                      <li>Every run emits structured events that you can inspect in the Activity view.</li>
                    </ul>
                  )}
                  {s.step === "04" && (
                    <ul className="mt-2 list-disc pl-4 text-xs text-muted-foreground">
                      <li>Review the PRD Lite, plan, and diff directly from your Git provider.</li>
                      <li>Use the Run detail view to understand exactly what GoAI did and when.</li>
                      <li>Merge when ready—GoAI never merges for you by default.</li>
                    </ul>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-t border-border bg-muted/30 py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Pricing that scales with your team
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Start with a pilot, then roll out across squads. You only pay for real workflows that ship value.
          </p>
          <div className="mt-10 grid gap-6 text-left sm:grid-cols-3">
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <p className="text-xs font-semibold uppercase text-primary">Starter</p>
                <p className="mt-2 text-3xl font-bold text-foreground">$0</p>
                <p className="mt-1 text-xs text-muted-foreground">for internal pilots</p>
                <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
                  <li>• Up to 3 projects</li>
                  <li>• 50 workflow runs / month</li>
                  <li>• Email support</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-primary/40 bg-card">
              <CardContent className="p-6">
                <p className="text-xs font-semibold uppercase text-primary">Growth</p>
                <p className="mt-2 text-3xl font-bold text-foreground">$X / month</p>
                <p className="mt-1 text-xs text-muted-foreground">for product teams in production</p>
                <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
                  <li>• Unlimited projects</li>
                  <li>• 1,000 workflow runs / month</li>
                  <li>• Priority support & SSO</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <p className="text-xs font-semibold uppercase text-primary">Enterprise</p>
                <p className="mt-2 text-3xl font-bold text-foreground">Let’s talk</p>
                <p className="mt-1 text-xs text-muted-foreground">for org-wide rollout</p>
                <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
                  <li>• Custom SLAs and security review</li>
                  <li>• Dedicated environment and VPC peering</li>
                  <li>• Implementation support and training</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="mt-10 flex justify-center gap-4">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <Link to="/register">
                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
              <Terminal className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">GoAI</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 GoAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

