"use client";

import Link from "next/link";
import { ArrowLeft, Code2 } from "lucide-react";
import { useAuth, ROLE_HOME } from "@/hooks/use-auth";
import { ProfileForm } from "@/components/auth/profile-form";
import { Button } from "@/components/ui/button";

export function ProfileShell() {
  const { user, logout } = useAuth();
  const home = user ? ROLE_HOME[user.role] : "/login";

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Code2 className="h-6 w-6 text-primary" />
            <span>DevAssess</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={home}>
                <ArrowLeft className="h-4 w-4" /> Back to dashboard
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => logout()}>
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="p-6">
        <ProfileForm />
      </main>
    </div>
  );
}
