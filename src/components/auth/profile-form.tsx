"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { authApi, getApiErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RoleBadge } from "@/components/shared/status-badge";

export function ProfileForm() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [name, setName] = useState(user?.name ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    try {
      const updated = await authApi.updateProfile({
        name,
        avatarUrl: avatarUrl || undefined,
      });
      setUser(updated);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to update profile"));
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your display name and avatar.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input value={user.email} disabled />
        </div>
        <div className="space-y-1.5">
          <Label>Role</Label>
          <RoleBadge role={user.role} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="avatar">Avatar URL</Label>
          <Input
            id="avatar"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://…"
          />
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
        <Button onClick={handleSave} disabled={loading || !name.trim()}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Save changes"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
