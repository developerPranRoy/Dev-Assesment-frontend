import Link from "next/link";
import { CheckCircle2, CreditCard } from "lucide-react";
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
export const metadata = { title: "Payment successful — DevAssess" };

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="h-7 w-7 text-green-600" />
          </div>
          <CardTitle className="text-xl">Payment successful</CardTitle>
          <CardDescription>
            Your Stripe payment was completed. Credits are granted once the
            payment webhook is processed — usually within a few seconds.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            If credits don&apos;t appear right away, refresh the credits page in
            a moment.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link href="/company/credits">
              <CreditCard className="h-4 w-4" /> View credits
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
