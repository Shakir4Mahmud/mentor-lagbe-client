import Link from "next/link";
import { ArrowLeft, Home, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Payment Cancelled | GuruLagbe",
};

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/15 text-amber-500">
        <XCircle className="h-11 w-11" />
      </span>

      <h1 className="mt-6 text-3xl font-semibold">Payment cancelled</h1>

      <p className="mt-3 text-muted-foreground">
        You cancelled the payment, so no money was charged. You can upgrade to
        Pro anytime from the pricing page.
      </p>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild size="lg" className="rounded-full">
          <Link href="/pricing">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pricing
          </Link>
        </Button>

        <Button asChild size="lg" variant="outline" className="rounded-full">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  );
}