import { Suspense } from "react";
import SslPaymentSuccess from "@/components/payment/SslPaymentSuccess";

export const metadata = {
  title: "SSLCommerz Payment Status | MentorLagbe",
};

export default function SslSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-24 text-center text-sm text-muted-foreground">
          Confirming your payment…
        </div>
      }
    >
      <SslPaymentSuccess />
    </Suspense>
  );
}
