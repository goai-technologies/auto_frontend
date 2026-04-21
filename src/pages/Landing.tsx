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
  Layers,
  Lock,
  Gauge,
  RefreshCw,
  Workflow,
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
    title: "Ticket To PR With Confidence Guard",
    description:
      "Runs evaluate confidence and route low-confidence work to manual review, with explicit accepted, needs review, and rejected states.",
  },
  {
    icon: Zap,
    title: "Concurrency-Safe Orchestration",
    description:
      "Per-project and repository locks prevent duplicate active executions, keeping workflow runs deterministic and conflict-free.",
  },
  {
    icon: RefreshCw,
    title: "Run and Step Reruns",
    description:
      "Operators can rerun full workflows or specific failed steps without restarting everything, preserving context and accelerating recovery.",
  },
  {
    icon: Plug,
    title: "Integration Health and Secrets Safety",
    description:
      "Connected providers expose health and error state while credentials stay encrypted at rest and never return in plaintext.",
  },
  {
    icon: Workflow,
    title: "Webhook and Auto-Trigger Ready",
    description:
      "Subscriptions and delivery logging support event-driven automation with clear visibility into trigger status and retry behavior.",
  },
  {
    icon: BarChart3,
    title: "Operational List Views",
    description:
      "Runs, projects, integrations, and users support filtering, search, sorting, and pagination for production-scale control.",
  },
];

const whatsNewItems = [
  {
    icon: Layers,
    title: "Postgres Persistence",
    description: "v1 workflows are backed by migrated SQL models for durable, queryable run history.",
  },
  {
    icon: Gauge,
    title: "Confidence Decision Engine",
    description: "Each run captures confidence score and decision to enable deterministic manual-review routing.",
  },
  {
    icon: GitPullRequest,
    title: "Jira Shadow Ticket Flow",
    description: "Execution can operate against shadow tickets while preserving the original issue link.",
  },
  {
    icon: RefreshCw,
    title: "Rerun Controls",
    description: "Rerun full runs or targeted steps using dedicated APIs designed for operations recovery.",
  },
  {
    icon: BarChart3,
    title: "Dashboard and Artifacts APIs",
    description: "Summary metrics, events, artifact list/detail, and activity feeds are now first-class endpoints.",
  },
  {
    icon: Shield,
    title: "Role-Protected Admin Surfaces",
    description: "Admin and operator roles enforce API-level permissions for integrations, users, and system controls.",
  },
  {
    icon: Plug,
    title: "Webhook and Delivery Logging",
    description: "Event subscriptions and delivery tracking support reliable trigger automation across ticket sources.",
  },
  {
    icon: Bot,
    title: "Onboarding and Health Readiness",
    description: "Backend-driven onboarding status and richer health/readiness signals improve rollout confidence.",
  },
];

const securityHighlights = [
  "Integration and workflow secrets are encrypted at rest.",
  "Role-protected actions are enforced for admin and operator scopes.",
  "Sensitive credential values are never returned to the UI in plaintext.",
];

const postLoginPanels = [
  "KPI cards for projects, runs, success rate, and integration health.",
  "Recent runs with confidence decisions and original/shadow ticket links.",
  "Onboarding progress with missing steps and first-run readiness state.",
  "Integrations health status with last-error visibility.",
  "System status indicators for readiness and operational dependencies.",
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
            <a href="#whats-new" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              What&apos;s New
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
            <span className="font-semibold text-foreground">5 minutes</span> with confidence decisions, shadow ticket
            execution, and rerun controls built for production operations.
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
                  <span className="text-success">✓</span> [09:15:10] Confidence accepted (0.91)
                </p>
                <p className="text-muted-foreground">
                  <span className="text-success">✓</span> [09:15:20] Shadow ticket created: PAY-5001
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
                  <span className="text-primary">✓</span> [09:18:30] PR created (rerun-ready) →{" "}
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
              Built for production workflow operations
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              From confidence-gated execution to role-protected administration, GoAI v1 turns ticket automation into a
              reliable control plane for engineering teams.
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

      <section id="whats-new" className="border-t border-border py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What&apos;s New in v1</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Major platform upgrades across persistence, orchestration, security, and operational visibility.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whatsNewItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
              >
                <Card className="h-full border-border bg-card">
                  <CardContent className="p-5">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="mb-1 text-sm font-semibold">{item.title}</h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-primary/20 bg-primary/5 p-6">
            <div className="flex items-start gap-3">
              <Lock className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <h3 className="text-sm font-semibold text-foreground">Security and trust by default</h3>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {securityHighlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-lg font-semibold text-foreground">Post-login control plane highlights</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Teams land on an operational dashboard designed for execution clarity and fast intervention.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {postLoginPanels.map((item) => (
                <div key={item} className="rounded-lg border border-border bg-card/60 p-3 text-sm text-muted-foreground">
                  {item}
                </div>
              ))}
            </div>
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
            Simple, per-seat pricing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Choose a plan that matches your operational needs. Upgrade any time.
          </p>
          <div className="mt-10 grid gap-6 text-left sm:grid-cols-3">
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <p className="text-xs font-semibold uppercase text-primary">Starter</p>
                <p className="mt-2 text-3xl font-bold text-foreground">$50</p>
                <p className="mt-1 text-xs text-muted-foreground">per seat / month</p>
                <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
                  <li>• Core ticket → PR runs</li>
                  <li>• Confidence gating + reruns</li>
                  <li>• Standard support</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-primary/40 bg-card">
              <CardContent className="p-6">
                <p className="text-xs font-semibold uppercase text-primary">Pro</p>
                <p className="mt-2 text-3xl font-bold text-foreground">$99</p>
                <p className="mt-1 text-xs text-muted-foreground">per seat / month</p>
                <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
                  <li>• Advanced filtering + artifacts</li>
                  <li>• Integrations health + webhooks</li>
                  <li>• Priority support</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <p className="text-xs font-semibold uppercase text-primary">Enterprise</p>
                <p className="mt-2 text-3xl font-bold text-foreground">Let’s talk</p>
                <p className="mt-1 text-xs text-muted-foreground">custom pricing</p>
                <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
                  <li>• SSO, RBAC controls, audit needs</li>
                  <li>• Dedicated environment options</li>
                  <li>• Custom SLAs and onboarding</li>
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
          <p className="mx-auto mt-4 max-w-2xl text-xs text-muted-foreground">
            Prices shown in USD. Taxes may apply. Seat counts are billed monthly. Contact us for annual and enterprise arrangements.
          </p>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
                <Terminal className="h-3 w-3 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">GoAI</span>
                <span className="text-[11px] text-muted-foreground">GoAI Solutions Private Limited</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
              <Link to="/login" className="hover:text-foreground transition-colors">Login</Link>
              <Link to="/register" className="hover:text-foreground transition-colors">Sign up</Link>
              <a href="/terms" className="hover:text-foreground transition-colors">Terms</a>
              <a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="/security" className="hover:text-foreground transition-colors">Security</a>
              <a href="/status" className="hover:text-foreground transition-colors">Status</a>
              <a href="mailto:support@goai.solutions" className="hover:text-foreground transition-colors">Support</a>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 GoAI Solutions Private Limited. All rights reserved.</p>
            <p className="text-[11px]">
              Product information on this page is representative and may change as the platform evolves.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

