"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Code2, Loader2, Plus, Search, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { problemApi, getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { DifficultyBadge, ProblemTypeBadge } from "@/components/shared/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import type { Difficulty, ProblemType } from "@/types";

const LIMIT = 8;

export function CompanyProblemsTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const qc = useQueryClient();

  const q = searchParams.get("q") ?? "";
  const type = (searchParams.get("type") as ProblemType | null) ?? null;
  const difficulty = (searchParams.get("difficulty") as Difficulty | null) ?? null;
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? LIMIT);

  const [searchInput, setSearchInput] = useState(q);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => setSearchInput(q), [q]);

  const query = useQuery({
    queryKey: ["problems", { q, type, difficulty, page, limit }],
    queryFn: () =>
      q
        ? problemApi.search(q)
        : problemApi.list({ type: type ?? undefined, difficulty: difficulty ?? undefined, page, limit }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => problemApi.delete(id),
    onSuccess: () => {
      toast.success("Problem deleted");
      setDeleteId(null);
      qc.invalidateQueries({ queryKey: ["problems"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, "Failed to delete")),
  });

  function updateUrl(params: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(params)) {
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    }
    if ("q" in params || "type" in params || "difficulty" in params) next.set("page", "1");
    router.push(`${pathname}?${next.toString()}`);
  }

  function onSearch(e: FormEvent) {
    e.preventDefault();
    updateUrl({ q: searchInput.trim() || null });
  }

  const rows = query.data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Problems"
        description="Author and manage your assessment problems."
        actions={
          <Button asChild>
            <Link href="/company/problems/new">
              <Plus className="h-4 w-4" /> New problem
            </Link>
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form onSubmit={onSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title…"
            className="pl-9"
          />
        </form>
        <Select value={type ?? "ALL"} onValueChange={(v) => updateUrl({ type: v === "ALL" ? null : v })}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All types</SelectItem>
            <SelectItem value="MCQ">MCQ</SelectItem>
            <SelectItem value="CODING">Coding</SelectItem>
            <SelectItem value="WRITTEN">Written</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={difficulty ?? "ALL"}
          onValueChange={(v) => updateUrl({ difficulty: v === "ALL" ? null : v })}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All difficulties</SelectItem>
            <SelectItem value="EASY">Easy</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HARD">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card">
        {query.isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={Code2}
            title="No problems found"
            description="Create your first problem to start building assessments."
            action={
              <Button asChild>
                <Link href="/company/problems/new">
                  <Plus className="h-4 w-4" /> New problem
                </Link>
              </Button>
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Points</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="max-w-xs truncate font-medium">{p.title}</TableCell>
                  <TableCell>
                    <ProblemTypeBadge type={p.type} />
                  </TableCell>
                  <TableCell>
                    <DifficultyBadge difficulty={p.difficulty} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.tags?.length ? p.tags.join(", ") : "—"}
                  </TableCell>
                  <TableCell>{p.points}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/company/problems/${p.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(p.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {query.data && q && (
        <p className="text-sm text-muted-foreground">
          Showing search results for &quot;{q}&quot; ({query.data.meta.total})
        </p>
      )}
      {query.data && <Pagination meta={query.data.meta} onPageChange={(p) => updateUrl({ page: String(p) })} />}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete problem"
        description="This soft-deletes the problem. It will no longer be available for new assessments."
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
      />
    </div>
  );
}
