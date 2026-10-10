import Link from "next/link";
import {
  Code2,
  ClipboardList,
  Users2,
  ShieldCheck,
  Timer,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  Zap,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 font-bold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
              <Code2 className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg tracking-tight">DevAssess</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">How it works</a>
            <a href="#roles" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Roles</a>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-sm" asChild>
              <Link href="/register">
                Get started <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b">
        {/* Background grid */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        {/* Gradient orb */}
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 blur-3xl" />

        <div className="container relative flex flex-col items-center gap-8 py-24 text-center md:py-32">
          <Badge
            variant="secondary"
            className="animate-in fade-in-0 slide-in-from-top-4 duration-500 gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium"
          >
            <Zap className="h-3 w-3 text-yellow-500" />
            Real backend · Stripe billing · 3 distinct roles
          </Badge>

          <h1 className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-150 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Assess developers with{" "}
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              real coding challenges
            </span>
          </h1>

          <p className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-200 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Build MCQ, coding, and written assessments. Invite candidates, auto-grade
            submissions, and evaluate written answers — all on a live platform with
            Stripe credit billing.
          </p>

          <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-300 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-md h-12 px-8"
              asChild
            >
              <Link href="/register">
                Start for free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8" asChild>
              <Link href="/login">Try the demo →</Link>
            </Button>
          </div>

          <p className="animate-in fade-in-0 duration-700 delay-500 text-xs text-muted-foreground">
            One-click demo login for all 3 roles on the sign-in page. No setup needed.
          </p>

          {/* Stats bar */}
          <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-500 mt-4 flex flex-wrap items-center justify-center gap-8 rounded-2xl border bg-card/50 px-8 py-5 shadow-sm backdrop-blur-sm">
            {[
              { value: "3", label: "Distinct roles" },
              { value: "MCQ · Code · Written", label: "Problem types" },
              { value: "Stripe", label: "Real billing" },
              { value: "JWT + OAuth", label: "Auth methods" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-lg font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────── */}
      <section id="features" className="border-b bg-muted/20">
        <div className="container py-20">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Badge variant="outline" className="mb-3">Features</Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Everything an engineering team needs
            </h2>
            <p className="mt-3 text-muted-foreground">
              From authoring problems to evaluating submissions — DevAssess covers the full hiring loop.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: ClipboardList,
                title: "Flexible assessments",
                description: "Combine MCQ, coding, and written questions into timed assessments with a configurable passing score.",
                gradient: "from-blue-500 to-indigo-600",
              },
              {
                icon: Timer,
                title: "Timed & monitored",
                description: "Candidates race against a live countdown. Tab-switching and focus changes are logged as flagged events.",
                gradient: "from-violet-500 to-purple-600",
              },
              {
                icon: ShieldCheck,
                title: "Role-based access",
                description: "Admin, Company, and Candidate roles with permissions enforced at both the route and UI level.",
                gradient: "from-rose-500 to-pink-600",
              },
              {
                icon: Users2,
                title: "Team collaboration",
                description: "Owners invite Creators and Evaluators. Each has scoped permissions — no accidental over-access.",
                gradient: "from-amber-500 to-orange-500",
              },
              {
                icon: CreditCard,
                title: "Stripe credit billing",
                description: "Buy invitation credits via real Stripe Checkout. Every invitation costs one credit — fully trackable.",
                gradient: "from-emerald-500 to-teal-600",
              },
              {
                icon: BarChart3,
                title: "Auto & manual grading",
                description: "MCQ graded instantly, coding via Judge0, written answers reviewed by evaluators with manual scoring.",
                gradient: "from-cyan-500 to-blue-500",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.gradient} shadow-sm`}>
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                {/* Hover accent */}
                <div className={`absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r ${f.gradient} transition-all duration-300 group-hover:w-full`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────── */}
      <section id="how-it-works" className="border-b">
        <div className="container py-20">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Badge variant="outline" className="mb-3">Process</Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">How it works</h2>
            <p className="mt-3 text-muted-foreground">
              From problem creation to candidate results in three simple steps.
            </p>
          </div>

          <div className="relative grid gap-8 md:grid-cols-3">
            {/* Connector line */}
            <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />

            {[
              {
                step: "01",
                title: "Create problems",
                description: "Author a library of MCQ, coding, and written problems. Add test cases for auto-grading.",
                color: "from-blue-500 to-indigo-600",
                checks: ["MCQ with auto-grading", "Coding via Judge0", "Written for manual review"],
              },
              {
                step: "02",
                title: "Build & publish",
                description: "Assemble problems into timed assessments, set a passing score, then publish and invite candidates.",
                color: "from-indigo-500 to-purple-600",
                checks: ["Set duration & passing score", "Invite by email", "Track invitations"],
              },
              {
                step: "03",
                title: "Evaluate & decide",
                description: "Review auto-scored results and manually evaluate written answers. Make faster hiring decisions.",
                color: "from-purple-500 to-pink-600",
                checks: ["Auto-scored MCQ & code", "Manual written evaluation", "Full audit trail"],
              },
            ].map((s) => (
              <div key={s.step} className="relative flex flex-col gap-4">
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} shadow-md`}>
                  <span className="text-xl font-bold text-white">{s.step}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                  <ul className="mt-3 space-y-1.5">
                    {s.checks.map((c) => (
                      <li key={c} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Roles ──────────────────────────────────────────────── */}
      <section id="roles" className="border-b bg-muted/20">
        <div className="container py-20">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Badge variant="outline" className="mb-3">Access control</Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Three distinct roles</h2>
            <p className="mt-3 text-muted-foreground">
              Every role gets its own dashboard, permissions, and one-click demo login.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                role: "Admin",
                gradient: "from-rose-500 to-orange-500",
                description: "Platform-wide visibility and control.",
                perms: ["View all users & change roles", "Platform dashboard with charts", "Full audit log history"],
                demo: { email: "admin@platform.dev", label: "Demo Admin" },
              },
              {
                role: "Company",
                gradient: "from-blue-500 to-indigo-600",
                description: "Build assessments and hire smarter.",
                perms: ["Create problems & assessments", "Invite candidates & buy credits", "Evaluate submissions"],
                demo: { email: "owner@acme.dev", label: "Demo Owner" },
              },
              {
                role: "Candidate",
                gradient: "from-emerald-500 to-teal-600",
                description: "Take assessments and track progress.",
                perms: ["Accept invitation tokens", "Timed attempt with question nav", "View scores & history"],
                demo: { email: "candidate@example.dev", label: "Demo Candidate" },
              },
            ].map((r) => (
              <div key={r.role} className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <div className={`h-1.5 w-full bg-gradient-to-r ${r.gradient}`} />
                <div className="p-6">
                  <div className={`mb-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${r.gradient} px-3 py-1`}>
                    <span className="text-xs font-semibold text-white">{r.role}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{r.description}</p>
                  <ul className="mt-4 space-y-2">
                    {r.perms.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 rounded-lg bg-muted/50 px-3 py-2.5">
                    <p className="text-[11px] text-muted-foreground">Demo account</p>
                    <p className="font-mono text-xs font-medium">{r.demo.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-md h-12 px-8"
              asChild
            >
              <Link href="/login">
                Try demo — one click per role <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="border-b relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5" />
        <div className="container relative flex flex-col items-center gap-6 py-24 text-center">
          <Badge variant="secondary" className="rounded-full">Ready to start?</Badge>
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
            Start assessing candidates today
          </h2>
          <p className="max-w-xl text-muted-foreground">
            Sign in with a demo account and explore the full platform — no setup, no credit card needed.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-md h-12 px-8"
              asChild
            >
              <Link href="/register">Create free account</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8" asChild>
              <Link href="/login">Explore the demo →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="py-10">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <Link href="/" className="flex items-center gap-2.5 font-bold">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                <Code2 className="h-3.5 w-3.5 text-white" />
              </div>
              <span>DevAssess</span>
            </Link>

            <p className="text-sm text-muted-foreground">
              Developer Assessment & Coding Platform — built with Next.js 14 + Stripe
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/login" className="hover:text-foreground transition-colors">Sign in</Link>
              <Link href="/register" className="hover:text-foreground transition-colors">Register</Link>
            </div>
          </div>

          <Separator className="my-6" />

          <p className="text-center text-xs text-muted-foreground">
            © 2026 DevAssess. Demo credentials: Password123! for all seeded accounts.
          </p>
        </div>
      </footer>
    </div>
  );
}
