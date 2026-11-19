"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileX, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import type { Application } from "@/types";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const filterTabs = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function MyApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const [cancelTarget, setCancelTarget] = useState<Application | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    async function loadApplications() {
      try {
        const data = await apiFetch<{ applications: Application[] }>(
          "/api/applications/my"
        );
        setApplications(data.applications);
      } catch {
        toast.error("Could not load your applications");
      }
      setLoading(false);
    }

    loadApplications();
  }, []);

  function countByStatus(status: string) {
    if (status === "all") {
      return applications.length;
    }
    return applications.filter((item) => item.status === status).length;
  }

  let shown = applications;
  if (filter !== "all") {
    shown = applications.filter((item) => item.status === filter);
  }

  async function handleCancel() {
    if (!cancelTarget) {
      return;
    }

    setCancelling(true);

    try {
      await apiFetch("/api/applications/" + cancelTarget._id, {
        method: "DELETE",
      });

      const remaining = applications.filter(
        (item) => item._id !== cancelTarget._id
      );
      setApplications(remaining);
      toast.success("Application cancelled");
      setCancelTarget(null);
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    }

    setCancelling(false);
  }

  if (loading) {
    const items = [1, 2, 3, 4];

    return (
      <div className="space-y-3">
        {items.map((item) => (
          <Skeleton key={item} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border bg-card px-6 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary">
          <FileX className="h-8 w-8" />
        </span>
        <h3 className="mt-5 text-xl font-semibold">No applications yet</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          When you apply for a tuition, it will show up here so you can track
          its status.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/tuitions">Browse Tuitions</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {filterTabs.map((tab) => {
          let tabClass =
            "rounded-full border px-4 py-1.5 text-sm font-medium transition ";
          if (filter === tab.key) {
            tabClass =
              tabClass + "border-primary bg-primary text-primary-foreground";
          } else {
            tabClass = tabClass + "bg-card hover:bg-secondary";
          }

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={tabClass}
            >
              {tab.label} ({countByStatus(tab.key)})
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <p className="mt-6 rounded-2xl border bg-card p-10 text-center text-muted-foreground">
          No {filter} applications.
        </p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-6 hidden overflow-hidden rounded-2xl border bg-card shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Tuition</th>
                    <th className="px-5 py-3 font-semibold">Tutor</th>
                    <th className="px-5 py-3 font-semibold">Monthly fee</th>
                    <th className="px-5 py-3 font-semibold">Applied</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {shown.map((item) => (
                    <tr key={item._id} className="transition hover:bg-muted/40">
                      <td className="max-w-[240px] px-5 py-4">
                        <Link
                          href={"/tuitions/" + item.tuitionId}
                          className="line-clamp-2 font-medium hover:text-primary"
                        >
                          {item.tuitionTitle}
                        </Link>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {item.subject}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium">{item.tutorName}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.tutorEmail}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-primary">
                        {item.monthlyFee.toLocaleString("en-US")} BDT
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                        {formatDate(item.appliedAt)}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={item.status} />
                      </td>

                      <td className="px-5 py-4 text-right">
                        {item.status === "pending" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCancelTarget(item)}
                            className="rounded-full text-destructive hover:text-destructive"
                          >
                            <Trash2 className="mr-1 h-4 w-4" />
                            Cancel
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No action
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="mt-6 space-y-4 md:hidden">
            {shown.map((item) => (
              <div
                key={item._id}
                className="rounded-2xl border bg-card p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={"/tuitions/" + item.tuitionId}
                    className="line-clamp-2 font-semibold hover:text-primary"
                  >
                    {item.tuitionTitle}
                  </Link>
                  <StatusBadge status={item.status} />
                </div>

                <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <p>
                    Tutor: <span className="text-foreground">{item.tutorName}</span>
                  </p>
                  <p>{item.tutorEmail}</p>
                  <p>
                    Fee:{" "}
                    <span className="font-semibold text-primary">
                      {item.monthlyFee.toLocaleString("en-US")} BDT
                    </span>
                  </p>
                  <p>Applied on {formatDate(item.appliedAt)}</p>
                </div>

                {item.status === "pending" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCancelTarget(item)}
                    className="mt-4 w-full rounded-full text-destructive hover:text-destructive"
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Cancel application
                  </Button>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Cancel confirm modal */}
      <Dialog
        open={cancelTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setCancelTarget(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel this application?</DialogTitle>
            <DialogDescription>
              {cancelTarget
                ? "Your application for " +
                  cancelTarget.tuitionTitle +
                  " will be removed. You can apply again later."
                : ""}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setCancelTarget(null)}
              disabled={cancelling}
              className="rounded-full"
            >
              Keep application
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={cancelling}
              className="rounded-full"
            >
              {cancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {cancelling ? "Cancelling..." : "Yes, cancel it"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}