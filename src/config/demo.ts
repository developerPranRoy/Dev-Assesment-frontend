import type { Role } from "@/types";

export interface DemoAccount {
  role: Role;
  label: string;
  email: string;
  password: string;
  description: string;
  accent: string; // tailwind classes for the button accent
  redirectPath: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "ADMIN",
    label: "Admin",
    email: "admin@platform.dev",
    password: "Password123!",
    description: "Platform-wide stats, users & audit logs",
    accent:
      "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300",
    redirectPath: "/admin/dashboard",
  },
  {
    role: "COMPANY",
    label: "Company Owner",
    email: "owner@acme.dev",
    password: "Password123!",
    description: "Create problems, assessments & buy credits",
    accent:
      "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
    redirectPath: "/company/dashboard",
  },
  {
    role: "CANDIDATE",
    label: "Candidate",
    email: "candidate@example.dev",
    password: "Password123!",
    description: "Take assessments & view results",
    accent:
      "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
    redirectPath: "/candidate/dashboard",
  },
];
