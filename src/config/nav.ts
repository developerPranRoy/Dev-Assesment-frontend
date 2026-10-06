import {
  LayoutDashboard,
  Users,
  ScrollText,
  Code2,
  ClipboardList,
  FileCheck2,
  Users2,
  CreditCard,
  BookOpen,
  History,
} from "lucide-react";
import type { NavItem } from "@/components/layout/app-shell";

export const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
];

export const COMPANY_NAV: NavItem[] = [
  { label: "Dashboard", href: "/company/dashboard", icon: LayoutDashboard },
  { label: "Problems", href: "/company/problems", icon: Code2 },
  { label: "Assessments", href: "/company/assessments", icon: ClipboardList },
  { label: "Submissions", href: "/company/submissions", icon: FileCheck2 },
  { label: "Members", href: "/company/members", icon: Users2 },
  { label: "Buy Credits", href: "/company/credits", icon: CreditCard },
];

export const CANDIDATE_NAV: NavItem[] = [
  { label: "Dashboard", href: "/candidate/dashboard", icon: LayoutDashboard },
  { label: "Assessments", href: "/candidate/assessments", icon: BookOpen },
  { label: "History", href: "/candidate/history", icon: History },
];
