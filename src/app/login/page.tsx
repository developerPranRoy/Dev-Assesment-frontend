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
      <div className="relative hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Code2 className="h-6 w-6" />
          <span className="text-lg">DevAssess</span>
        </Link>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold leading-tight">
            Assess developers with real coding challenges.
          </h2>
          <p className="max-w-md text-primary-foreground/80">
            Create assessments, invite candidates, and evaluate submissions — all
            in one platform built for engineering teams.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-2xl font-bold">3</p>
            <p className="text-primary-foreground/70">Distinct roles</p>
          </div>
          <div>
            <p className="text-2xl font-bold">MCQ · Code · Written</p>
          </div>
          <div>
            <p className="text-2xl font-bold">Stripe</p>
            <p className="text-primary-foreground/70">Credit billing</p>
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md space-y-6">
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
