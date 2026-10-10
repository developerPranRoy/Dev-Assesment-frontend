import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { DemoLoginButtons } from "@/components/auth/demo-login-buttons";
import { GoogleButton } from "@/components/auth/google-button";
import { Separator } from "@/components/ui/separator";
import { Code2 } from "lucide-react";

export const dynamic = 'force-dynamic';

export const metadata = { title: "Sign in — DevAssess" };

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: brand panel */}
      <div className="relative hidden flex-col justify-between bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-10 text-white lg:flex">
        {/* Grid overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
        <Link href="/" className="relative flex items-center gap-2.5 font-semibold z-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
            <Code2 className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg">DevAssess</span>
        </Link>
        <div className="relative z-10 space-y-4">
          <h2 className="text-3xl font-bold leading-tight">
            Assess developers with real coding challenges.
          </h2>
          <p className="text-white/70">
            Create assessments, invite candidates, and evaluate submissions — all
            in one platform built for engineering teams.
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-4 text-sm">
          <div className="rounded-lg bg-white/10 p-3">
            <p className="text-2xl font-bold">3</p>
            <p className="text-white/70 text-xs">Distinct roles</p>
          </div>
          <div className="rounded-lg bg-white/10 p-3">
            <p className="text-sm font-bold">MCQ · Code · Written</p>
            <p className="text-white/70 text-xs">Problem types</p>
          </div>
          <div className="rounded-lg bg-white/10 p-3">
            <p className="text-2xl font-bold">Stripe</p>
            <p className="text-white/70 text-xs">Credit billing</p>
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          <div className="space-y-2 text-center lg:text-left">
            <Link href="/" className="mb-2 inline-flex items-center gap-2 font-semibold lg:hidden">
              <Code2 className="h-5 w-5 text-primary" />
              <span>DevAssess</span>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your DevAssess account to continue.
            </p>
          </div>

          <Suspense fallback={<div className="h-64 animate-pulse rounded-md bg-muted" />}>
            <LoginForm />
          </Suspense>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
              or
            </span>
          </div>

          <GoogleButton />

          <Suspense fallback={<div className="h-40 animate-pulse rounded-md bg-muted" />}>
            <DemoLoginButtons />
          </Suspense>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
