"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import {
  CheckCircle2,
  Copy,
  Crown,
  Home,
  LayoutDashboard,
  Loader2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";

type Receipt = {
  planName: string;
  amount: number;
  currency: string;
  transactionId: string;
  paidAt: string;
  userRole: string;
};

export default function PaymentSuccess() {
  const searchParams = useSearchParams();

  let sessionId = "";
  const sessionParam = searchParams.get("session_id");
  if (sessionParam) {
    sessionId = sessionParam;
  }

  // Verify ekbar-i chalabo (dev mode e duibar na jay)
  const startedRef = useRef(false);

  const [status, setStatus] = useState("verifying");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (sessionId === "" || startedRef.current) {
      return;
    }
    startedRef.current = true;

    async function verifyPayment() {
      try {
        const data = await apiFetch<{ payment: Receipt }>(
          "/api/payments/verify",
          {
            method: "POST",
            body: JSON.stringify({ sessionId: sessionId }),
          }
        );

        setReceipt(data.payment);
        setStatus("success");
      } catch (error) {
        const err = error as Error;
        setErrorMessage(err.message);
        setStatus("error");
      }
    }

    verifyPayment();
  }, [sessionId]);

  // Full page reload korbo jate navbar e notun Pro plan dekhay
  function goTo(path: string) {
    window.location.href = path;
  }

  async function copyId() {
    if (!receipt) {
      return;
    }

    try {
      await navigator.clipboard.writeText(receipt.transactionId);
      toast.success("Transaction ID copied");
    } catch {
      toast.error("Could not copy the ID");
    }
  }

  // session_id na thakle
  if (sessionId === "") {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/15 text-rose-500">
          <XCircle className="h-8 w-8" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold">No payment found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This page opens after a Stripe payment. Start from the pricing page.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/pricing">Go to Pricing</Link>
        </Button>
      </div>
    );
  }

  if (status === "verifying") {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
        <h1 className="mt-6 text-2xl font-semibold">Confirming your payment</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Please wait a moment and do not close this page.
        </p>
      </div>
    );
  }

  if (status === "error" || !receipt) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/15 text-rose-500">
          <XCircle className="h-8 w-8" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold">
          We could not confirm the payment
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{errorMessage}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          If money was deducted from your account, please contact support.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/pricing">Back to Pricing</Link>
        </Button>
      </div>
    );
  }

  const paidDate = new Date(receipt.paidAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const amountText =
    receipt.amount.toLocaleString("en-US") +
    " " +
    receipt.currency.toUpperCase();

  const rows = [
    { label: "Plan", value: receipt.planName },
    { label: "Amount paid", value: amountText },
    { label: "Date", value: paidDate },
  ];

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-3xl border bg-card shadow-xl shadow-primary/10"
      >
        {/* Top gradient */}
        <div className="relative bg-hero-gradient px-6 py-10 text-center text-white">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/30 blur-3xl" />

          <div className="relative mx-auto h-20 w-20">
            <span className="absolute inset-0 animate-ping rounded-full bg-white/25 [animation-duration:2.4s]" />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 15 }}
              className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white text-emerald-500"
            >
              <CheckCircle2 className="h-11 w-11" />
            </motion.span>
          </div>

          <h1 className="relative mt-5 text-3xl font-semibold">
            Payment successful!
          </h1>
          <p className="relative mt-2 flex items-center justify-center gap-2 text-white/85">
            <Crown className="h-4 w-4 text-accent" />
            You are now on {receipt.planName}
          </p>
        </div>

        {/* Receipt */}
        <div className="p-6">
          <div className="divide-y rounded-2xl border">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-semibold">{row.value}</span>
              </div>
            ))}

            <div className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
              <span className="text-muted-foreground">Transaction ID</span>
              <button
                type="button"
                onClick={copyId}
                title="Copy transaction ID"
                className="flex max-w-[190px] items-center gap-2 rounded-lg bg-muted px-2.5 py-1.5 font-mono text-xs transition hover:bg-secondary"
              >
                <span className="truncate">{receipt.transactionId}</span>
                <Copy className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button
              size="lg"
              onClick={() => goTo("/dashboard/" + receipt.userRole)}
              className="rounded-full"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => goTo("/")}
              className="rounded-full"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}