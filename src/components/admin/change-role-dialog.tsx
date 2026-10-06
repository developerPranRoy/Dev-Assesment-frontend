"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { adminApi, getApiErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Role, User } from "@/types";

export function ChangeRoleDialog({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<Role>(user.role);
  const [loading, setLoading] = useState(false);
  const qc = useQueryClient();

  async function handleSave() {
    if (role === user.role) {
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      await adminApi.changeUserRole(user.id, { role });
      toast.success(`${user.name} is now a ${role}`);
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      qc.invalidateQueries({ queryKey: ["admin-users-count"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      setOpen(false);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to change role"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Change role
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change role</DialogTitle>
          <DialogDescription>
            Update the role for <span className="font-medium">{user.name}</span> ({user.email}).
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label>New role</Label>
          <Select value={role} onValueChange={(v) => setRole(v as Role)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="COMPANY">Company</SelectItem>
              <SelectItem value="CANDIDATE">Candidate</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading || role === user.role}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
