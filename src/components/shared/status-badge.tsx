import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  AssessmentStatus,
  AttemptStatus,
  Difficulty,
  InvitationStatus,
  PaymentStatus,
  PermissionLevel,
  ProblemType,
  Role,
  SubmissionStatus,
} from "@/types";

export function RoleBadge({ role }: { role: Role }) {
  const map: Record<Role, { label: string; className: string }> = {
    ADMIN: { label: "Admin", className: "bg-rose-100 text-rose-700 border-rose-200" },
    COMPANY: { label: "Company", className: "bg-blue-100 text-blue-700 border-blue-200" },
    CANDIDATE: { label: "Candidate", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  };
  const v = map[role];
  return <Badge variant="outline" className={cn(v.className)}>{v.label}</Badge>;
}

export function PermissionBadge({ level }: { level: PermissionLevel }) {
  const map: Record<PermissionLevel, { variant: "default" | "secondary" | "outline" }> = {
    OWNER: { variant: "default" },
    CREATOR: { variant: "secondary" },
    EVALUATOR: { variant: "outline" },
  };
  return <Badge variant={map[level].variant}>{level}</Badge>;
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const map: Record<Difficulty, string> = {
    EASY: "bg-emerald-100 text-emerald-700 border-emerald-200",
    MEDIUM: "bg-amber-100 text-amber-700 border-amber-200",
    HARD: "bg-rose-100 text-rose-700 border-rose-200",
  };
  return (
    <Badge variant="outline" className={cn(map[difficulty])}>
      {difficulty}
    </Badge>
  );
}

export function ProblemTypeBadge({ type }: { type: ProblemType }) {
  const map: Record<ProblemType, string> = {
    CODING: "bg-violet-100 text-violet-700 border-violet-200",
    MCQ: "bg-sky-100 text-sky-700 border-sky-200",
    WRITTEN: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return (
    <Badge variant="outline" className={cn(map[type])}>
      {type}
    </Badge>
  );
}

export function AssessmentStatusBadge({ status }: { status: AssessmentStatus }) {
  const map: Record<AssessmentStatus, { variant: "default" | "secondary" | "warning" | "outline" }> = {
    DRAFT: { variant: "outline" },
    PUBLISHED: { variant: "default" },
    ARCHIVED: { variant: "secondary" },
  };
  return <Badge variant={map[status].variant}>{status}</Badge>;
}

export function AttemptStatusBadge({ status }: { status: AttemptStatus }) {
  const map: Record<AttemptStatus, string> = {
    NOT_STARTED: "bg-slate-100 text-slate-700 border-slate-200",
    IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
    SUBMITTED: "bg-amber-100 text-amber-700 border-amber-200",
    EVALUATED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    EXPIRED: "bg-rose-100 text-rose-700 border-rose-200",
  };
  return (
    <Badge variant="outline" className={cn(map[status])}>
      {status.replace("_", " ")}
    </Badge>
  );
}

export function InvitationStatusBadge({ status }: { status: InvitationStatus }) {
  const map: Record<InvitationStatus, string> = {
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
    ACCEPTED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    EXPIRED: "bg-rose-100 text-rose-700 border-rose-200",
  };
  return (
    <Badge variant="outline" className={cn(map[status])}>
      {status}
    </Badge>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const map: Record<PaymentStatus, { variant: "default" | "secondary" | "destructive" }> = {
    PENDING: { variant: "secondary" },
    COMPLETED: { variant: "default" },
    FAILED: { variant: "destructive" },
  };
  return <Badge variant={map[status].variant}>{status}</Badge>;
}

export function SubmissionStatusBadge({ status }: { status: SubmissionStatus }) {
  const map: Record<SubmissionStatus, string> = {
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
    EVALUATED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  };
  return (
    <Badge variant="outline" className={cn(map[status])}>
      {status}
    </Badge>
  );
}
