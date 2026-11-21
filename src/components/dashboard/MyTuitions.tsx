"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Eye,
  FileX,
  Loader2,
  Pencil,
  PlusCircle,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import type { MyTuition, Tuition } from "@/types";
import StatusBadge from "@/components/dashboard/StatusBadge";
import EditTuitionDialog from "@/components/dashboard/EditTuitionDialog";
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
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

export default function MyTuitions() {
  const [tuitions, setTuitions] = useState<MyTuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const [busyId, setBusyId] = useState("");
  const [editTarget, setEditTarget] = useState<MyTuition | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MyTuition | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadTuitions() {
      try {
        const data = await apiFetch<{ tuitions: MyTuition[] }>(
          "/api/tuitions/my"
        );
        setTuitions(data.tuitions);
      } catch {
        toast.error("Could not load your tuitions");
      }
      setLoading(false);
    }

    loadTuitions();
  }, []);

  function countByStatus(status: string) {
    if (status === "all") {
      return tuitions.length;
    }
    return tuitions.filter((item) => item.approvalStatus === status).length;
  }

  let shown = tuitions;
  if (filter !== "all") {
    shown = tuitions.filter((item) => item.approvalStatus === filter);
  }

  // Active / Closed toggle
  async function handleToggle(item: MyTuition) {
    setBusyId(item._id);

    try {
      await apiFetch("/api/tuitions/" + item._id + "/status", {
        method: "PATCH",
        body: JSON.stringify({ isActive: !item.isActive }),
      });

      const updatedList = tuitions.map((t) => {
        if (t._id === item._id) {
          return { ...t, isActive: !t.isActive };
        }
        return t;
      });
      setTuitions(updatedList);

      if (item.isActive) {
        toast.success("Tuition closed");
      } else {
        toast.success("Tuition reopened");
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    }

    setBusyId("");
  }

  // Edit save hole list e notun data boshabo
  function handleSaved(updated: Tuition) {
    const updatedList = tuitions.map((t) => {
      if (t._id === updated._id) {
        return { ...updated, applicantCount: t.applicantCount };
      }
      return t;
    });

    setTuitions(updatedList);
    setEditTarget(null);
  }

  async function handleDelete() {
    if (!deleteTarget) {
      return;
    }

    setDeleting(true);

    try {
      await apiFetch("/api/tuitions/" + deleteTarget._id, {
        method: "DELETE",
      });

      const remaining = tuitions.filter((t) => t._id !== deleteTarget._id);
      setTuitions(remaining);
      toast.success("Tuition deleted");
      setDeleteTarget(null);
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    }

    setDeleting(false);
  }

  if (loading) {
    const items = [1, 2, 3];

    return (
      <div className="space-y-4">
        {items.map((item) => (
          <Skeleton key={item} className="h-36 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (tuitions.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border bg-card px-6 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary">
          <FileX className="h-8 w-8" />
        </span>
        <h3 className="mt-5 text-xl font-semibold">No tuitions yet</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Post your first tuition and start receiving applications from
          students.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/dashboard/tutor/post-tuition">
            <PlusCircle className="mr-2 h-4 w-4" />
            Post a Tuition
          </Link>
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
          No {filter} tuitions.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {shown.map((item) => {
            // Status er niche choto note
            let note = "";
            if (item.approvalStatus === "pending") {
              note = "Waiting for admin approval";
            } else if (item.approvalStatus === "rejected") {
              note = "Rejected by admin. Edit and resubmit.";
            } else if (!item.isActive) {
              note = "Closed. Hidden from students.";
            } else {
              note = "Live on Browse Tuitions";
            }

            const isLive = item.approvalStatus === "approved" && item.isActive;

            let switchClass =
              "relative h-6 w-11 shrink-0 rounded-full transition disabled:opacity-60 ";
            let knobClass =
              "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ";
            if (item.isActive) {
              switchClass = switchClass + "bg-primary";
              knobClass = knobClass + "left-[22px]";
            } else {
              switchClass = switchClass + "bg-muted-foreground/30";
              knobClass = knobClass + "left-0.5";
            }

            return (
              <div
                key={item._id}
                className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center"
              >
                {/* Banner */}
                <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-xl bg-secondary sm:h-24 sm:w-36">
                  <div className="absolute inset-0 flex items-center justify-center text-primary/30">
                    <BookOpen className="h-8 w-8" />
                  </div>

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.bannerImage}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={item.approvalStatus} />
                    <span
                      className={
                        "rounded-full px-3 py-1 text-xs font-semibold " +
                        (item.isActive
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground")
                      }
                    >
                      {item.isActive ? "Active" : "Closed"}
                    </span>
                  </div>

                  <h3 className="mt-2 line-clamp-1 font-heading text-lg font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.subject} · {item.classLevel} · {item.mode} ·{" "}
                    {item.daysPerWeek} days/week
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">{note}</p>
                </div>

                {/* Fee, applicants, switch */}
                <div className="flex shrink-0 items-center justify-between gap-6 sm:flex-col sm:items-end sm:justify-center sm:gap-2">
                  <div className="sm:text-right">
                    <p className="font-heading text-lg font-bold text-primary">
                      {item.monthlyFee.toLocaleString("en-US")} BDT
                    </p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground sm:justify-end">
                      <Users className="h-3.5 w-3.5" />
                      {item.applicantCount}{" "}
                      {item.applicantCount === 1 ? "applicant" : "applicants"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {item.isActive ? "Active" : "Closed"}
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={item.isActive}
                      aria-label="Toggle active or closed"
                      disabled={busyId === item._id}
                      onClick={() => handleToggle(item)}
                      className={switchClass}
                    >
                      <span className={knobClass} />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 gap-2 sm:flex-col">
                  {isLive && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-full"
                    >
                      <Link href={"/tuitions/" + item._id}>
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Link>
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditTarget(item)}
                    className="flex-1 rounded-full"
                  >
                    <Pencil className="mr-1 h-4 w-4" />
                    Edit
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteTarget(item)}
                    className="flex-1 rounded-full text-destructive hover:text-destructive"
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit modal */}
      {editTarget && (
        <EditTuitionDialog
          key={editTarget._id}
          tuition={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={handleSaved}
        />
      )}

      {/* Delete confirm modal */}
      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setDeleteTarget(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this tuition?</DialogTitle>
            <DialogDescription>
              {deleteTarget
                ? deleteTarget.title +
                  " and all its student applications will be permanently removed."
                : ""}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
              className="rounded-full"
            >
              Keep tuition
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-full"
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {deleting ? "Deleting..." : "Yes, delete it"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}