"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CreditCard, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { useCompany } from "@/hooks/use-company";
import { useAuthStore } from "@/store/auth-store";
import { paymentApi, getApiErrorMessage } from "@/lib/api";
import { CREDIT_PRICE_USD } from "@/lib/constants";
import { PageHeader } from "@/components/shared/page-header";
import { CompanySetupCard } from "@/components/company/company-setup-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

export function CompanyCredits() {
  const router = useRouter();
  const { company, isLoading, needsSetup } = useCompany();
  const currentUserId = useAuthStore((s) => s.user?.id);
  const isOwner = company?.ownerId === currentUserId;

  const [credits, setCredits] = useState(10);

  const price = (credits * CREDIT_PRICE_USD).toFixed(2);

  async function handleBuy() {
    if (!isOwner) {
      toast.error("Only the company owner can buy credits.");
      return;
    }
    try {
      const { checkoutUrl } = await paymentApi.initiate({ credits });
      toast.success("Redirecting to Stripe checkout…");
      window.location.href = checkoutUrl;
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to start payment"));
    }
  }

  if (needsSetup) return <CompanySetupCard />;

  return (
    <div className="space-y-6">
      <PageHeader title="Buy credits" description="1 credit = 1 invited candidate. Billed at $0.50 each via Stripe." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" /> Your balance
            </CardTitle>
            <CardDescription>Current credits available for invitations.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : (
              <p className="text-4xl font-bold">{company?.credits ?? 0}</p>
            )}
            <p className="mt-1 text-sm text-muted-foreground">credits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Purchase credits
            </CardTitle>
            <CardDescription>Secure payment via Stripe (test mode).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isOwner ? (
              <>
                <div>
                  <label className="text-sm font-medium">Number of credits</label>
                  <Input
                    type="number"
                    min={1}
                    max={1000}
                    value={credits}
                    onChange={(e) => setCredits(Math.max(1, Number(e.target.value) || 0))}
                  />
                </div>
                <div className="flex items-center justify-between rounded-md bg-muted/50 px-4 py-3">
                  <span className="text-sm text-muted-foreground">
                    {credits} × {formatCurrency(CREDIT_PRICE_USD)}
                  </span>
                  <span className="text-lg font-bold">{formatCurrency(Number(price))}</span>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Only the company owner can purchase credits.
              </p>
            )}
          </CardContent>
          <CardFooter>
            {isOwner ? (
              <Button className="w-full" onClick={handleBuy} disabled={isLoading}>
                <ShieldCheck className="h-4 w-4" /> Buy with Stripe
              </Button>
            ) : (
              <Button variant="outline" className="w-full" onClick={() => router.push("/company/dashboard")}>
                Back to dashboard
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
