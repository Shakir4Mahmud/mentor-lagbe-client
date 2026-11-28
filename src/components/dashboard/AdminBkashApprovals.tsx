"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, Inbox, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import type {
  BkashPaymentRequest,
  BkashPaymentsResponse,
} from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function AdminBkashApprovals() {
  const [requests, setRequests] = useState<BkashPaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    async function loadRequests() {
      try {
        const data = await apiFetch<BkashPaymentsResponse>(
          "/api/admin/bkash/payments"
        );
        setRequests(data.requests);
      } catch {
        toast.error("Could not load bKash payments");
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, []);

  async function review(id: string, status: "approved" | "rejected") {
    setBusyId(id);

    try {
      await apiFetch(`/api/admin/bkash/payments/${id}/approval`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      setRequests((current) =>
        current.map((item) =>
          item._id === id ? { ...item, status } : item
        )
      );

      toast.success(
        status === "approved"
          ? "Payment approved. Pro plan activated."
          : "Payment rejected."
      );
    } catch (error) {
      toast.error((error as Error).message || "Could not review the payment");
    } finally {
      setBusyId(null);
    }
  }

  const pendingCount = requests.filter((item) => item.status === "pending").length;

  // Pending requests stay on top so the admin sees new work first.
  const sorted = [...requests].sort((a, b) => {
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (b.status === "pending" && a.status !== "pending") return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <section className="rounded-3xl border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">bKash payments</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Manual Send Money requests waiting for approval
          </p>
        </div>

        {pendingCount > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-500">
            <Clock className="h-3.5 w-3.5" />
            {pendingCount} pending
          </span>
        )}
      </div>

      {loading ? (
        <div className="mt-5 space-y-3">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
            <Inbox className="h-6 w-6" />
          </span>
          <p className="mt-3 text-sm text-muted-foreground">
            No bKash requests yet. You are all caught up.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {sorted.map((item) => {
            const isPending = item.status === "pending";
            const isBusy = busyId === item._id;

            return (
              <div
                key={item._id}
                className="flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold">
                      {item.userName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.userEmail}
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.planName} · {item.amount} {item.currency} ·{" "}
                    {formatDate(item.createdAt)}
                  </p>
                </div>

                {isPending ? (
                  <div className="flex shrink-0 gap-2">
                    <Button
                      size="sm"
                      disabled={isBusy}
                      onClick={() => review(item._id, "approved")}
                      className="rounded-full bg-emerald-500 text-white hover:bg-emerald-500/90"
                    >
                      {isBusy ? (
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                      )}
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isBusy}
                      onClick={() => review(item._id, "rejected")}
                      className="rounded-full"
                    >
                      <XCircle className="mr-1.5 h-3.5 w-3.5" />
                      Reject
                    </Button>
                  </div>
                ) : (
                  <span
                    className={
                      item.status === "approved"
                        ? "inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-500"
                        : "inline-flex items-center gap-1.5 text-xs font-semibold text-rose-500"
                    }
                  >
                    {item.status === "approved" ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5" />
                    )}
                    {item.status === "approved" ? "Approved" : "Rejected"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
