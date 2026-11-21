"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Check,
  ExternalLink,
  Eye,
  FileSearch,
  GraduationCap,
  Laptop,
  Loader2,
  MapPin,
  Search,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import type { Tuition } from "@/types";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const filterTabs = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "all", label: "All" },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminTuitions() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [search, setSearch] = useState("");

  const [busyId, setBusyId] = useState("");
  const [detailTarget, setDetailTarget] = useState<Tuition | null>(null);

  useEffect(() => {
    async function loadTuitions() {
      try {
        const data = await apiFetch<{ tuitions: Tuition[] }>(
          "/api/admin/tuitions"
        );
        setTuitions(data.tuitions);
      } catch {
        toast.error("Could not load tuitions");
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

  // Filter ar search ek shathe
  const searchText = search.trim().toLowerCase();

  const shown = tuitions.filter((item) => {
    if (filter !== "all" && item.approvalStatus !== filter) {
      return false;
    }

    if (searchText === "") {
      return true;
    }

    const title = item.title.toLowerCase();
    const tutor = item.tutorName.toLowerCase();
    const subject = item.subject.toLowerCase();

    return (
      title.includes(searchText) ||
      tutor.includes(searchText) ||
      subject.includes(searchText)
    );
  });

  async function updateApproval(item: Tuition, status: string) {
    setBusyId(item._id);

    try {
      await apiFetch("/api/admin/tuitions/" + item._id + "/approval", {
        method: "PATCH",
        body: JSON.stringify({ status: status }),
      });

      const updatedList = tuitions.map((t) => {
        if (t._id === item._id) {
          return { ...t, approvalStatus: status };
        }
        return t;
      });
      setTuitions(updatedList);

      // Details modal khola thakle oitao update hobe
      if (detailTarget && detailTarget._id === item._id) {
        setDetailTarget({ ...detailTarget, approvalStatus: status });
      }

      if (status === "approved") {
        toast.success("Tuition approved. It is now live.");
      } else {
        toast.success("Tuition rejected");
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    }

    setBusyId("");
  }

  // Approve ar Reject button, card ar modal dujaygay use hoy
  function renderDecisionButtons(item: Tuition) {
    const busy = busyId === item._id;

    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          disabled={busy || item.approvalStatus === "approved"}
          onClick={() => updateApproval(item, "approved")}
          className="flex-1 rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
        >
          {busy ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          ) : (
            <Check className="mr-1 h-4 w-4" />
          )}
          Approve
        </Button>

        <Button
          size="sm"
          variant="outline"
          disabled={busy || item.approvalStatus === "rejected"}
          onClick={() => updateApproval(item, "rejected")}
          className="flex-1 rounded-full text-rose-600 hover:text-rose-600"
        >
          <X className="mr-1 h-4 w-4" />
          Reject
        </Button>
      </div>
    );
  }

  if (loading) {
    const items = [1, 2, 3, 4, 5, 6];

    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Skeleton key={item} className="h-96 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (tuitions.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border bg-card px-6 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary">
          <FileSearch className="h-8 w-8" />
        </span>
        <h3 className="mt-5 text-xl font-semibold">No tuitions yet</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          When tutors post tuitions, they will appear here for your review.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Search and filter */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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

        <div className="relative w-full lg:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, tutor or subject"
            className="h-10 w-full rounded-full border bg-card pl-10 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-2xl border bg-card px-6 py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
            <Check className="h-7 w-7" />
          </span>
          <p className="mt-4 font-medium">
            {filter === "pending"
              ? "All caught up, nothing is waiting"
              : "No tuitions found"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different tab or search.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((item) => {
            let modeClass =
              "absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold shadow ";
            if (item.mode === "Online") {
              modeClass = modeClass + "bg-primary text-primary-foreground";
            } else {
              modeClass = modeClass + "bg-accent text-accent-foreground";
            }

            return (
              <div
                key={item._id}
                className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
              >
                {/* Banner */}
                <div className="relative h-40 w-full shrink-0 overflow-hidden bg-secondary">
                  <div className="absolute inset-0 flex items-center justify-center text-primary/30">
                    <BookOpen className="h-10 w-10" />
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

                  <span className={modeClass}>{item.mode}</span>

                  {!item.isActive && (
                    <span className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
                      Closed
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {item.subject}
                    </p>
                    <StatusBadge status={item.approvalStatus} />
                  </div>

                  <h3 className="mt-2 line-clamp-2 min-h-[3.5rem] font-heading text-lg font-semibold leading-snug">
                    {item.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-primary">
                      {item.tutorName.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {item.tutorName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {item.tutorEmail}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="font-bold text-primary">
                      {item.monthlyFee.toLocaleString("en-US")} BDT
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Posted {formatDate(item.createdAt)}
                    </span>
                  </div>

                  {/* Actions (shob somoy niche) */}
                  <div className="mt-auto space-y-2 pt-4">
                    {renderDecisionButtons(item)}

                    <button
                      type="button"
                      onClick={() => setDetailTarget(item)}
                      className="flex w-full items-center justify-center gap-1.5 py-1 text-sm font-medium text-primary hover:underline"
                    >
                      <Eye className="h-4 w-4" />
                      View details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details modal */}
      <Dialog
        open={detailTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDetailTarget(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {detailTarget && (
            <>
              <DialogHeader>
                <DialogTitle>{detailTarget.title}</DialogTitle>
                <DialogDescription>
                  Review all details before you approve or reject.
                </DialogDescription>
              </DialogHeader>

              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-secondary">
                <div className="absolute inset-0 flex items-center justify-center text-primary/30">
                  <BookOpen className="h-12 w-12" />
                </div>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={detailTarget.bannerImage}
                  alt={detailTarget.title}
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={detailTarget.approvalStatus} />
                <span
                  className={
                    "rounded-full px-3 py-1 text-xs font-semibold " +
                    (detailTarget.isActive
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground")
                  }
                >
                  {detailTarget.isActive ? "Active" : "Closed"}
                </span>
              </div>

              <div className="grid gap-3 rounded-2xl bg-muted/60 p-4 text-sm sm:grid-cols-2">
                <p className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  {detailTarget.subject}
                </p>
                <p className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  {detailTarget.classLevel}
                </p>
                <p className="flex items-center gap-2">
                  <Laptop className="h-4 w-4 text-primary" />
                  {detailTarget.mode}
                </p>
                <p className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  {detailTarget.daysPerWeek} days / week
                </p>
                <p className="flex items-center gap-2 sm:col-span-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {detailTarget.location}
                </p>
              </div>

              <div className="flex items-center justify-between rounded-2xl border p-4">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Tutor</p>
                  <p className="truncate font-semibold">
                    {detailTarget.tutorName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {detailTarget.tutorEmail}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Monthly fee</p>
                  <p className="font-heading text-xl font-bold text-primary">
                    {detailTarget.monthlyFee.toLocaleString("en-US")} BDT
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold">Description</p>
                <p className="mt-2 whitespace-pre-line break-words rounded-2xl border p-4 text-sm leading-relaxed text-muted-foreground">
                  {detailTarget.description}
                </p>
              </div>

              <p className="text-xs text-muted-foreground">
                Posted on {formatDate(detailTarget.createdAt)}
              </p>

              <div className="space-y-3">
                {renderDecisionButtons(detailTarget)}

                {detailTarget.approvalStatus === "approved" &&
                  detailTarget.isActive && (
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="w-full rounded-full"
                    >
                      <Link
                        href={"/tuitions/" + detailTarget._id}
                        target="_blank"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View live page
                      </Link>
                    </Button>
                  )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}