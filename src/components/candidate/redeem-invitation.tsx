"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Ticket } from "lucide-react";
import { invitationApi, getApiErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RedeemInvitation({ initialToken }: { initialToken?: string }) {
  const router = useRouter();
  const [token, setToken] = useState(initialToken ?? "");
  const [loading, setLoading] = useState(false);

  async function handleAccept(t: string) {
    if (!t.trim()) {
      toast.error("Enter an invitation token");
      return;
    }
    setLoading(true);
    try {
      const invitation = await invitationApi.accept(t.trim());
      toast.success("Invitation accepted");
      router.push(`/candidate/assessments/${invitation.assessmentId}`);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Invalid or expired invitation"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="h-5 w-5 text-primary" /> Redeem an invitation
        </CardTitle>
        <CardDescription>
          Paste the invitation token you received to view and start the assessment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAccept(token);
          }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <Input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="invitation token"
            className="font-mono"
          />
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Accept"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
