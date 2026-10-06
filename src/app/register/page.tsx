import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { GoogleButton } from "@/components/auth/google-button";
import { Separator } from "@/components/ui/separator";
import { Code2 } from "lucide-react";

export const dynamic = 'force-dynamic';

export const metadata = { title: "Create account — DevAssess" };

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="text-lg">DevAssess</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            Start taking or building assessments in minutes.
          </p>
        </div>

        <RegisterForm />

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
            or
          </span>
        </div>

        <GoogleButton />

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
