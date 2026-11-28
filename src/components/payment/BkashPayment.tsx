"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Loader2, Smartphone, Wallet } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import type { BkashStatus, BkashStatusResponse } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const BKASH_NAME = "Shakir Mahmud";
const BKASH_NUMBER = "01747740061";
const BKASH_APP_URL = "https://www.bkash.com/en/app";

type BkashPaymentProps = {
  price: number;
};

export default function BkashPayment({ price }: BkashPaymentProps) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<BkashStatus>("none");
  const [confirming, setConfirming] = useState(false);
  const [copied, setCopied] = useState(false);

  async function loadStatus() {
    try {
      const data = await apiFetch<BkashStatusResponse>(
        "/api/payments/bkash/status"
      );
      setStatus(data.status);
    } catch {
      setStatus("none");
    }
  }

  function handleOpenChange(next: boolean) {
    if (next && !isPending && !session) {
      router.push("/sign-in?redirect=/pricing");
      return;
    }

    setOpen(next);

    if (next) {
      void loadStatus();
    }
  }

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(BKASH_NUMBER);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the number. Please copy it manually.");
    }
  }

  // Best-effort deep link for phones/tablets. If the app is not installed,
  // the browser falls back to the official bKash app page.
  function openBkashApp() {
    const frame = document.createElement("iframe");
    frame.style.display = "none";
    frame.src = "bkash://";
    document.body.appendChild(frame);

    window.setTimeout(() => {
      frame.remove();
      if (!document.hidden) {
        window.location.href = BKASH_APP_URL;
      }
    }, 1200);
  }

  async function confirmPayment() {
    setConfirming(true);

    try {
      const data = await apiFetch<{ status: BkashStatus }>(
        "/api/payments/bkash/request",
        { method: "POST" }
      );
      setStatus(data.status || "pending");
      toast.success("Request sent. Wait for admin approval.");
    } catch (error) {
      const message = (error as Error).message;

      if (message.includes("already")) {
        setStatus("pending");
        toast.info(message);
      } else {
        toast.error(message || "Could not submit the payment request");
      }
    } finally {
      setConfirming(false);
    }
  }

  let confirmLabel = "Confirm Payment";
  if (status === "pending") {
    confirmLabel = "Wait for admin approval";
  } else if (status === "approved") {
    confirmLabel = "Payment approved";
  }

  const confirmDisabled =
    confirming || status === "pending" || status === "approved";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          variant="outline"
          className="w-full rounded-full border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
        >
          <Wallet className="mr-2 h-4 w-4" />
          Pay with bKash
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Pay with bKash</DialogTitle>
          <DialogDescription>
            bKash payment is not available yet. Please use bKash Send Money.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-2xl border bg-card p-5 text-card-foreground">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Amount to send
            </span>
            <span className="font-semibold">{price} BDT</span>
          </div>

          <div className="mt-5">
            <p className="text-xs text-muted-foreground">Send Money to</p>
            <p className="mt-1 text-base font-semibold">{BKASH_NAME}</p>
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-xl border bg-muted/40 p-2 pl-4">
            <span className="min-w-0 flex-1 select-all font-mono text-lg font-semibold tracking-wide">
              {BKASH_NUMBER}
            </span>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={copyNumber}
              className="rounded-lg"
            >
              {copied ? (
                <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="mr-1.5 h-3.5 w-3.5" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Send Money to this number, then tap Confirm Payment. An
            administrator will review the payment and activate your Pro plan.
          </p>

          {/* Phones and tablets only — laptop users copy the number instead. */}
          <Button
            type="button"
            variant="outline"
            onClick={openBkashApp}
            className="mt-4 w-full rounded-full lg:hidden"
          >
            <Smartphone className="mr-2 h-4 w-4" />
            Open bKash App
          </Button>

          <Button
            type="button"
            onClick={confirmPayment}
            disabled={confirmDisabled}
            className="mt-3 w-full rounded-full"
          >
            {confirming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmLabel}
          </Button>

          {status === "rejected" && (
            <p className="mt-3 text-xs text-amber-500">
              Your previous request was rejected. Contact support before
              sending money again.
            </p>
          )}

          {status === "approved" && (
            <p className="mt-3 text-xs text-emerald-500">
              Your payment is approved and Pro is active.
            </p>
          )}

          <p className="mt-3 text-xs text-muted-foreground">
            Never share your bKash PIN with anyone.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
