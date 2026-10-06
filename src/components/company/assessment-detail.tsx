"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2,
  Pencil,
  Trash2,
  Rocket,
  Archive,
  FileDown,
  Copy,
  Mail,
  Plus,
  Search,
} from "lucide-react";
import {
  assessmentApi,
  invitationApi,
  problemApi,
  getApiErrorMessage,
} from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { AssessmentStatusBadge, ProblemTypeBadge, DifficultyBadge, InvitationStatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { AssessmentForm } from "@/components/company/assessment-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatDateTime } from "@/lib/utils";
import type { AssessmentStatus, Problem } from "@/types";

export function AssessmentDetail({ assessmentId }: { assessmentId: string }) {
  const router = useRouter();
  const qc = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [statusDialog, setStatusDialog] = useState<AssessmentStatus | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: assessment, isLoading } = useQuery({
    queryKey: ["assessment", assessmentId],
    queryFn: () => assessmentApi.get(assessmentId),
  });

  const statusMutation = useMutation({
    mutationFn: (status: AssessmentStatus) => assessmentApi.changeStatus(assessmentId, status),
    onSuccess: () => {
      toast.success("Status updated");
      setStatusDialog(null);
      qc.invalidateQueries({ queryKey: ["assessment", assessmentId] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, "Failed to change status")),
  });

  const deleteMutation = useMutation({
    mutationFn: () => assessmentApi.delete(assessmentId),
    onSuccess: () => {
      toast.success("Assessment deleted");
      qc.invalidateQueries({ queryKey: ["assessments"] });
      router.push("/company/assessments");
    },
    onError: (err) => toast.error(getApiErrorMessage(err, "Failed to delete")),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!assessment) {
    return (<p className="text-sm text-muted-foreground">Assessment not found.</p>);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={assessment.title}
        description={assessment.description ?? undefined}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4" /> Edit
            </Button>
            <Button variant="outline" className="text-destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <AssessmentStatusBadge status={assessment.status} />
        <span className="text-sm text-muted-foreground">{assessment.durationMinutes} min · pass {assessment.passingScore}</span>
        <span className="text-sm text-muted-foreground">Created {formatDate(assessment.createdAt)}</span>
        {assessment.status === "DRAFT" && (
          <Button size="sm" onClick={() => setStatusDialog("PUBLISHED")}>
            <Rocket className="h-4 w-4" /> Publish
          </Button>
        )}
        {assessment.status === "PUBLISHED" && (
          <>
            <Button size="sm" variant="outline" onClick={() => setStatusDialog("ARCHIVED")}>
              <Archive className="h-4 w-4" /> Archive
            </Button>
            <Button size="sm" variant="outline" onClick={() => setStatusDialog("DRAFT")}>
              <FileDown className="h-4 w-4" /> Revert to draft
            </Button>
          </>
        )}
        {assessment.status === "ARCHIVED" && (
          <Button size="sm" onClick={() => setStatusDialog("PUBLISHED")}>
            <Rocket className="h-4 w-4" /> Re-publish
          </Button>
        )}
      </div>

      <Tabs defaultValue="problems" className="w-full">
        <TabsList>
          <TabsTrigger value="problems">Problems ({assessment.problems?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row label="Title" value={assessment.title} />
              <Row label="Description" value={assessment.description ?? "—"} />
              <Row label="Duration" value={`${assessment.durationMinutes} minutes`} />
              <Row label="Passing score" value={`${assessment.passingScore} / 100`} />
              <Row label="Status" value={assessment.status} />
              <Row label="Created" value={formatDateTime(assessment.createdAt)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="problems" className="mt-4">
          <ProblemsTab assessmentId={assessmentId} attached={assessment.problems ?? []} />
        </TabsContent>

        <TabsContent value="invitations" className="mt-4">
          <InvitationsTab assessmentId={assessmentId} status={assessment.status} />
        </TabsContent>
      </Tabs>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit assessment</DialogTitle>
          </DialogHeader>
          <AssessmentForm
            assessment={assessment}
            onSuccess={() => {
              setEditOpen(false);
              qc.invalidateQueries({ queryKey: ["assessment", assessmentId] });
            }}
            onCancel={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!statusDialog}
        onOpenChange={(o) => !o && setStatusDialog(null)}
        title={`Set status to ${statusDialog ?? ""}?`}
        description={
          statusDialog === "PUBLISHED"
            ? "Published assessments can be taken by invited candidates. Make sure at least one problem is attached."
            : "This changes the assessment status. Invited candidates may be affected."
        }
        confirmLabel="Confirm"
        loading={statusMutation.isPending}
        onConfirm={() => statusDialog && statusMutation.mutate(statusDialog)}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete assessment"
        description="This soft-deletes the assessment. This cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 border-b pb-2 last:border-0 last:pb-0">
      <span className="w-32 shrink-0 text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function ProblemsTab({
  assessmentId,
  attached,
}: {
  assessmentId: string;
  attached: Array<{ id: string; order: number; points: number; problem?: Problem }>;
}) {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [selected, setSelected] = useState<Problem | null>(null);
  const [order, setOrder] = useState((attached.length + 1).toString());
  const [points, setPoints] = useState("10");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const searchQ = useQuery({
    queryKey: ["problem-search", debounced],
    queryFn: () => (debounced ? problemApi.search(debounced) : problemApi.list({ page: 1, limit: 20 })),
  });

  const addMutation = useMutation({
    mutationFn: () =>
      assessmentApi.addProblem(assessmentId, {
        problemId: selected!.id,
        order: Number(order),
        points: Number(points),
      }),
    onSuccess: () => {
      toast.success("Problem added to assessment");
      setSelected(null);
      setOrder((attached.length + 2).toString());
      qc.invalidateQueries({ queryKey: ["assessment", assessmentId] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, "Failed to add problem")),
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add a problem</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your problem library…"
              className="pl-9"
            />
          </div>
          <div className="max-h-48 space-y-1 overflow-y-auto rounded-md border">
            {(searchQ.data?.data ?? []).length === 0 ? (
              <p className="p-4 text-center text-sm text-muted-foreground">No problems found.</p>
            ) : (
              (searchQ.data?.data ?? []).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className={`flex w-full items-center justify-between p-2 text-left text-sm transition-colors hover:bg-muted ${
                    selected?.id === p.id ? "bg-primary/10" : ""
                  }`}
                >
                  <span className="truncate">{p.title}</span>
                  <span className="text-xs text-muted-foreground">{p.type}</span>
                </button>
              ))
            )}
          </div>
          {selected && (
            <div className="flex flex-col gap-3 rounded-md border bg-muted/30 p-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Selected</p>
                <p className="text-sm font-medium">{selected.title}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Order</label>
                <Input type="number" min={1} value={order} onChange={(e) => setOrder(e.target.value)} className="w-20" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Points</label>
                <Input type="number" min={0} value={points} onChange={(e) => setPoints(e.target.value)} className="w-20" />
              </div>
              <Button onClick={() => addMutation.mutate()} disabled={addMutation.isPending}>
                {addMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Add
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="rounded-lg border bg-card">
        {attached.length === 0 ? (
          <EmptyState icon={Plus} title="No problems attached" description="Search above and add problems to this assessment." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...attached]
                .sort((a, b) => a.order - b.order)
                .map((ap) => (
                  <TableRow key={ap.id}>
                    <TableCell>{ap.order}</TableCell>
                    <TableCell className="font-medium">{ap.problem?.title ?? "—"}</TableCell>
                    <TableCell>{ap.problem && <ProblemTypeBadge type={ap.problem.type} />}</TableCell>
                    <TableCell>{ap.problem && <DifficultyBadge difficulty={ap.problem.difficulty} />}</TableCell>
                    <TableCell>{ap.points}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function InvitationsTab({ assessmentId, status }: { assessmentId: string; status: AssessmentStatus }) {
  const qc = useQueryClient();
  const [emails, setEmails] = useState("");

  const { data: invitations, isLoading } = useQuery({
    queryKey: ["invitations", assessmentId],
    queryFn: () => invitationApi.list(assessmentId),
  });

  const inviteMutation = useMutation({
    mutationFn: () => {
      const list = emails
        .split(/[,\s\n]+/)
        .map((e) => e.trim())
        .filter(Boolean);
      return invitationApi.invite(assessmentId, { emails: list });
    },
    onSuccess: (created) => {
      toast.success(`Invited ${created.length} candidate${created.length === 1 ? "" : "s"}`);
      setEmails("");
      qc.invalidateQueries({ queryKey: ["invitations", assessmentId] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, "Failed to send invitations")),
  });

  const published = status === "PUBLISHED";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invite candidates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!published && (
            <p className="rounded-md bg-warning/10 px-3 py-2 text-sm text-warning">
              You can only invite candidates to a published assessment.
            </p>
          )}
          <textarea
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            disabled={!published}
            rows={3}
            placeholder="candidate1@x.com, candidate2@x.com"
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button onClick={() => inviteMutation.mutate()} disabled={!published || !emails.trim() || inviteMutation.isPending}>
            {inviteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            Send invitations
          </Button>
        </CardContent>
      </Card>

      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (invitations ?? []).length === 0 ? (
          <EmptyState icon={Mail} title="No invitations yet" description="Invite candidates to see them here." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Token</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(invitations ?? []).map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium">{inv.candidateEmail}</TableCell>
                  <TableCell>
                    <InvitationStatusBadge status={inv.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(inv.expiresAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <code className="max-w-[120px] truncate text-xs text-muted-foreground">{inv.token}</code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => {
                          navigator.clipboard?.writeText(inv.token);
                          toast.success("Token copied");
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
