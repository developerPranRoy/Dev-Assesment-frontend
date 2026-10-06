"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationMeta } from "@/types";

interface PaginationProps {
  meta?: PaginationMeta;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ meta, onPageChange, className }: PaginationProps) {
  if (!meta || meta.totalPages <= 1) {
    if (!meta) return null;
    return (
      <p className={cn_("text-sm text-muted-foreground", className)}>
        Showing {meta.total} result{meta.total === 1 ? "" : "s"}
      </p>
    );
  }

  const { page, totalPages } = meta;
  const pages = getPageNumbers(page, totalPages);

  return (
    <div className={cn_("flex items-center justify-between gap-2", className)}>
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages} · {meta.total} total
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-4 w-4" /> Prev
        </Button>
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">
              …
            </span>
          ) : (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(p as number)}
              className="min-w-8"
            >
              {p}
            </Button>
          ),
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

// local cn to avoid circular import churn
function cn_(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}
