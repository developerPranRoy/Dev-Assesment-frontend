import Link from "next/link";
import { Code2, ClipboardList, Users2, ShieldCheck, Timer, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="text-lg">DevAssess</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container flex flex-col items-center gap-6 py-20 text-center md:py-28">
          <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-xs">
            Real backend · Stripe billing · 3 distinct roles
          </Badge>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
            Assess developers with{" "}
            <span className="text-primary">real coding challenges</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Build MCQ, coding, and written assessments. Invite candidates by email,
            auto-grade submissions, and evaluate written answers — all powered by a
            live backend with Stripe credit billing.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/register">
                Start building <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Try the demo</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            One-click demo login for Admin, Company, and Candidate roles on the sign-in page.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30">
        <div className="container py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Everything an engineering team needs</h2>
            <p className="mt-2 text-muted-foreground">
              From authoring problems to evaluating submissions — DevAssess covers the full loop.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Feature
              icon={ClipboardList}
              title="Flexible assessments"
              description="Combine MCQ, coding, and written questions into timed assessments with a passing score."
            />
            <Feature
              icon={Timer}
              title="Timed & monitored attempts"
              description="Candidates take assessments against a live countdown. Tab-switching is logged as flagged events."
            />
            <Feature
              icon={ShieldCheck}
              title="Role-based access"
              description="Three distinct roles — Admin, Company, and Candidate — with strictly enforced permissions."
            />
            <Feature
              icon={Users2}
              title="Team collaboration"
              description="Owners add Creators and Evaluators to their company with scoped permission levels."
            />
            <Feature
              icon={CreditCard}
              title="Stripe credit billing"
              description="Buy invitation credits via real Stripe Checkout. Success and cancel flows handled on return."
            />
            <Feature
              icon={Code2}
              title="Auto & manual grading"
              description="MCQ graded instantly, written answers reviewed by evaluators with manual scoring."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t">
        <div className="container py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <Step number="01" title="Create problems" description="Company users author a library of MCQ, coding, and written problems." />
            <Step number="02" title="Build & publish" description="Assemble problems into timed assessments, then publish and invite candidates." />
            <Step number="03" title="Evaluate" description="Auto-graded scores plus manual review of written answers, then review results." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-primary text-primary-foreground">
        <div className="container flex flex-col items-center gap-6 py-20 text-center">
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight">
            Ready to assess your next hire?
          </h2>
          <p className="max-w-xl text-primary-foreground/80">
            Sign in with a demo account and explore the full platform in seconds.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/login">Explore the demo</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
            <Code2 className="h-5 w-5 text-primary" />
            DevAssess
          </Link>
          <p>Developer Assessment & Coding Platform</p>
        </div>
      </footer>
    </div>
  );
}

function Feature({ icon: Icon, title, description }: { icon: typeof Code2; title: string; description: string }) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div>
      <p className="text-5xl font-bold text-primary/20">{number}</p>
      <h3 className="mt-2 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
