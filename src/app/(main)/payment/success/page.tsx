import { Suspense } from "react";
import PaymentSuccess from "@/components/payment/PaymentSuccess";

export const metadata = {
  title: "Payment Successful | GuruLagbe",
};

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccess />
    </Suspense>
  );
}