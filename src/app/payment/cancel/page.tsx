import Link from "next/link";
import { XCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";
export const metadata = { title: "Payment cancelled — DevAssess" };

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <XCircle className="h-7 w-7 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl">Payment cancelled</CardTitle>
          <CardDescription>
            Your Stripe checkout was cancelled and no payment was taken. Your
            credit balance is unchanged.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You can try again whenever you&apos;re ready.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link href="/company/credits">
              <CreditCard className="h-4 w-4" /> Try again
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/company/dashboard">Back to dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
