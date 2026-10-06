"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Send,
  Lock,
} from "lucide-react";
import { attemptApi, submissionApi, getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { ProblemTypeBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn, formatDuration } from "@/lib/utils";
import type { AssessmentProblem, AttemptStatus } from "@/types";

const HEARTBEAT_MS = 30_000;
const CODING_LANGUAGES = [
  { id: 63, label: "JavaScript (Node)" },
  { id: 71, label: "Python 3" },
  { id: 62, label: "Java" },
  { id: 50, label: "C" },
  { id: 54, label: "C++" },
];

export function ActiveAttempt({ attemptId }: { attemptId: string }) {
  const router = useRouter();
  const qc = useQueryClient();
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [languageIds, setLanguageIds] = useState<Record<string, number>>({});
  const [answered, setAnswered] = useState<Set<string>>(new Set());
  const [submitOpen, setSubmitOpen] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const submitGuard = useRef(false);

  const { data: attempt, isLoading } = useQuery({
    queryKey: ["attempt", attemptId],
    queryFn: () => attemptApi.get(attemptId),
    refetchInterval: 60_000,
  });

  const problems: AssessmentProblem[] = useMemo(() => {
    const list = attempt?.assessment?.problems ?? [];
    return [...list].sort((a, b) => a.order - b.order);
  }, [attempt]);

  // Pre-populate answered set from any existing submissions.
  useEffect(() => {
    if (!attempt?.submissions) return;
    const set = new Set<string>();
    for (const s of attempt.submissions) set.add(s.problemId);
    setAnswered((prev) => new Set([...Array.from(prev), ...Array.from(set)]));
  }, [attempt]);

  // Countdown timer + auto-submit.
  useEffect(() => {
    if (!attempt?.startedAt || !attempt.assessment) return;
    const endAt = new Date(attempt.startedAt).getTime() + attempt.assessment.durationMinutes * 60_000;
    const tick = () => {
      const diff = Math.max(0, Math.floor((endAt - Date.now()) / 1000));
      setRemaining(diff);
      if (diff <= 0 && !submitGuard.current) {
        submitGuard.current = true;
        toast.info("Time is up — submitting your attempt.");
        doSubmit();
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  // Heartbeat: every 30s + on tab visibility changes.
  useEffect(() => {
    if (!attempt || attempt.status !== "IN_PROGRESS") return;
    const beat = (event: string) => {
      attemptApi.heartbeat(attemptId, event).catch(() => {});
    };
    const interval = setInterval(() => beat("heartbeat"), HEARTBEAT_MS);
    const onVisibility = () => {
      beat(document.hidden ? "tab_blur" : "tab_focus");
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", () => beat("tab_blur"));
    window.addEventListener("focus", () => beat("tab_focus"));
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  const submitAnswerMutation = useMutation({
    mutationFn: ({ problemId, answer, languageId }: { problemId: string; answer: string; languageId?: number }) =>
      submissionApi.submitAnswer(attemptId, { problemId, answer, languageId }),
    onSuccess: (_data, vars) => {
      setAnswered((prev) => new Set(prev).add(vars.problemId));
      toast.success("Answer saved");
    },
    onError: (err, vars) => {
      const msg = getApiErrorMessage(err, "Failed to submit answer");
      if (/409|already/i.test(msg)) {
        setAnswered((prev) => new Set(prev).add(vars.problemId));
        toast.info("This question was already answered.");
      } else {
        toast.error(msg);
      }
    },
  });

  const submitAttemptMutation = useMutation({
    mutationFn: () => attemptApi.submit(attemptId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-history"] });
      toast.success("Attempt submitted");
      router.push("/candidate/history");
    },
    onError: (err) => toast.error(getApiErrorMessage(err, "Failed to submit attempt")),
  });

  const doSubmit = useCallback(() => {
    submitAttemptMutation.mutate();
  }, [submitAttemptMutation]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!attempt) {
    return <p className="text-sm text-muted-foreground">Attempt not found.</p>;
  }

  const isLive = attempt.status === "IN_PROGRESS";

  if (!isLive) {
    return <AttemptFinished status={attempt.status} score={attempt.score} onBack={() => router.push("/candidate/history")} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader title={attempt.assessment?.title ?? "Attempt"} description="Answer each question, then submit when you're done." />
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg border px-4 py-2 font-mono text-lg font-semibold",
            (remaining ?? 0) < 60 ? "border-destructive/50 bg-destructive/10 text-destructive" : "bg-muted",
          )}
        >
          <Clock className="h-5 w-5" />
          {remaining != null ? formatDuration(remaining) : "--:--"}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Navigator */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Questions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-5 gap-2 lg:grid-cols-3">
              {problems.map((ap, i) => {
                const isAnswered = answered.has(ap.problemId);
                return (
                  <button
                    key={ap.id}
                    onClick={() => setActiveIndex(i)}
                    className={cn(
                      "flex h-9 items-center justify-center rounded-md border text-sm font-medium transition-colors",
                      i === activeIndex
                        ? "border-primary bg-primary text-primary-foreground"
                        : isAnswered
                          ? "border-success/40 bg-success/10 text-success"
                          : "hover:bg-muted",
                    )}
                    aria-label={`Question ${i + 1}`}
                  >
                    {isAnswered ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </button>
                );
              })}
            </CardContent>
            <CardContent className="pt-0 text-xs text-muted-foreground">
              {answered.size}/{problems.length} answered
            </CardContent>
          </Card>
          <Button
            className="mt-3 w-full"
            onClick={() => setSubmitOpen(true)}
            disabled={submitAttemptMutation.isPending}
          >
            <Send className="h-4 w-4" /> Submit attempt
          </Button>
        </div>

        {/* Active question */}
        <div>
          {problems.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                This assessment has no questions.
              </CardContent>
            </Card>
          ) : (
            <QuestionCard
              key={problems[activeIndex].id}
              ap={problems[activeIndex]}
              index={activeIndex}
              total={problems.length}
              answer={answers[problems[activeIndex].problemId] ?? ""}
              languageId={languageIds[problems[activeIndex].problemId]}
              isAnswered={answered.has(problems[activeIndex].problemId)}
              onAnswer={(v) =>
                setAnswers((prev) => ({ ...prev, [problems[activeIndex].problemId]: v }))
              }
              onLanguage={(id) =>
                setLanguageIds((prev) => ({ ...prev, [problems[activeIndex].problemId]: id }))
              }
              onSubmit={() =>
                submitAnswerMutation.mutate({
                  problemId: problems[activeIndex].problemId,
                  answer: answers[problems[activeIndex].problemId] ?? "",
                  languageId:
                    problems[activeIndex].problem?.type === "CODING"
                      ? languageIds[problems[activeIndex].problemId] ?? 63
                      : undefined,
                })
              }
              submitting={submitAnswerMutation.isPending}
              onPrev={() => setActiveIndex((i) => Math.max(0, i - 1))}
              onNext={() => setActiveIndex((i) => Math.min(problems.length - 1, i + 1))}
            />
          )}
        </div>
      </div>

      <ConfirmDialog
        open={submitOpen}
        onOpenChange={setSubmitOpen}
        title="Submit your attempt?"
        description={`You've answered ${answered.size} of ${problems.length} questions. Once submitted, you can't change your answers.`}
        confirmLabel="Submit final"
        loading={submitAttemptMutation.isPending}
        onConfirm={doSubmit}
      />
    </div>
  );
}

function QuestionCard({
  ap,
  index,
  total,
  answer,
  languageId,
  isAnswered,
  onAnswer,
  onLanguage,
  onSubmit,
  submitting,
  onPrev,
  onNext,
}: {
  ap: AssessmentProblem;
  index: number;
  total: number;
  answer: string;
  languageId?: number;
  isAnswered: boolean;
  onAnswer: (v: string) => void;
  onLanguage: (id: number) => void;
  onSubmit: () => void;
  submitting: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  const problem = ap.problem;
  const options = (problem?.options as string[] | null | undefined) ?? [];
  const type = problem?.type;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">
            <span className="text-muted-foreground">Question {index + 1} of {total}</span>
            <span className="ml-2">{problem?.title}</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            {problem && <ProblemTypeBadge type={problem.type} />}
            <span className="text-sm font-medium">{ap.points} pts</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="whitespace-pre-wrap text-sm">{problem?.statement}</p>

        {type === "MCQ" && (
          <div className="space-y-2">
            {options.map((opt, i) => (
              <label
                key={i}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm transition-colors hover:bg-muted/50",
                  answer === opt && "border-primary bg-primary/5",
                )}
              >
                <input
                  type="radio"
                  name={`q-${ap.id}`}
                  value={opt}
                  checked={answer === opt}
                  onChange={() => onAnswer(opt)}
                  className="h-4 w-4"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        )}

        {type === "WRITTEN" && (
          <Textarea
            rows={8}
            value={answer}
            onChange={(e) => onAnswer(e.target.value)}
            placeholder="Type your answer…"
          />
        )}

        {type === "CODING" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">Language</label>
              <select
                value={languageId ?? 63}
                onChange={(e) => onLanguage(Number(e.target.value))}
                className="rounded-md border border-input bg-transparent px-2 py-1 text-sm"
              >
                {CODING_LANGUAGES.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
            <Textarea
              rows={12}
              value={answer}
              onChange={(e) => onAnswer(e.target.value)}
              placeholder="// write your solution here"
              className="font-mono text-sm"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onPrev} disabled={index === 0}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={onNext} disabled={index === total - 1}>
              Next
            </Button>
          </div>
          <div className="flex items-center gap-3">
            {isAnswered ? (
              <span className="flex items-center gap-1 text-sm text-success">
                <CheckCircle2 className="h-4 w-4" /> Answered
              </span>
            ) : (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Circle className="h-4 w-4" /> Not answered
              </span>
            )}
            <Button onClick={onSubmit} disabled={submitting || !answer.trim()}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save answer"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AttemptFinished({
  status,
  score,
  onBack,
}: {
  status: AttemptStatus;
  score?: number | null;
  onBack: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        {status === "EXPIRED" ? (
          <AlertTriangle className="h-7 w-7 text-warning" />
        ) : (
          <Lock className="h-7 w-7 text-muted-foreground" />
        )}
      </div>
      <h2 className="mt-4 text-xl font-bold">
        {status === "EXPIRED" ? "Time expired" : "Attempt submitted"}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {status === "EXPIRED"
          ? "Your attempt was auto-submitted when the timer ran out."
          : "This attempt has been submitted and is no longer editable."}
        {score != null && ` Your score: ${score}.`}
      </p>
      <Button className="mt-4" onClick={onBack}>
        Back to history
      </Button>
    </div>
  );
}
