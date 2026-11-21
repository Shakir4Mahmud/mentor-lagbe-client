"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Check,
  Eye,
  Inbox,
  Loader2,
  Mail,
  Phone,
  Search,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import type { ReceivedApplication } from "@/types";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

type StudentAvatarProps = {
  name: string;
  image: string;
};

function StudentAvatar({ name, image }: StudentAvatarProps) {
  return (
    <Avatar className="h-10 w-10 shrink-0">
      <AvatarImage src={image} alt={name} />
      <AvatarFallback className="bg-primary text-primary-foreground">
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}

export default function TutorApplicants() {
  const [applications, setApplications] = useState<ReceivedApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [busyId, setBusyId] = useState("");
  const [detailTarget, setDetailTarget] =
    useState<ReceivedApplication | null>(null);

  useEffect(() => {
    async function loadApplicants() {
      try {
        const data = await apiFetch<{ applications: ReceivedApplication[] }>(
          "/api/tutor/applicants"
        );
        setApplications(data.applications);
      } catch {
        toast.error("Could not load applicants");
      }
      setLoading(false);
    }

    loadApplicants();
  }, []);

  function countByStatus(status: string) {
    if (status === "all") {
      return applications.length;
    }
    return applications.filter((item) => item.status === status).length;
  }

  // Filter ar search ek shathe
  const searchText = search.trim().toLowerCase();

  const shown = applications.filter((item) => {
    if (filter !== "all" && item.status !== filter) {
      return false;
    }

    if (searchText === "") {
      return true;
    }

    const name = item.studentName.toLowerCase();
    const email = item.studentEmail.toLowerCase();
    const title = item.tuitionTitle.toLowerCase();

    return (
      name.includes(searchText) ||
      email.includes(searchText) ||
      title.includes(searchText)
    );
  });

  async function updateStatus(item: ReceivedApplication, status: string) {
    setBusyId(item._id);

    try {
      await apiFetch("/api/tutor/applicants/" + item._id + "/status", {
        method: "PATCH",
        body: JSON.stringify({ status: status }),
      });

      const updatedList = applications.map((app) => {
        if (app._id === item._id) {
          return { ...app, status: status };
        }
        return app;
      });
      setApplications(updatedList);

      // Details modal khola thakle oitao update hobe
      if (detailTarget && detailTarget._id === item._id) {
        setDetailTarget({ ...detailTarget, status: status });
      }

      if (status === "accepted") {
        toast.success("Application accepted");
      } else {
        toast.success("Application rejected");
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    }

    setBusyId("");
  }

  // Accept ar Reject button, tinjaygay use hoy
  function renderDecisionButtons(item: ReceivedApplication) {
    const busy = busyId === item._id;

    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          disabled={busy || item.status === "accepted"}
          onClick={() => updateStatus(item, "accepted")}
          className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
        >
          {busy ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          ) : (
            <Check className="mr-1 h-4 w-4" />
          )}
          Accept
        </Button>

        <Button
          size="sm"
          variant="outline"
          disabled={busy || item.status === "rejected"}
          onClick={() => updateStatus(item, "rejected")}
          className="rounded-full text-rose-600 hover:text-rose-600"
        >
          <X className="mr-1 h-4 w-4" />
          Reject
        </Button>
      </div>
    );
  }

  if (loading) {
    const items = [1, 2, 3, 4];

    return (
      <div className="space-y-3">
        {items.map((item) => (
          <Skeleton key={item} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border bg-card px-6 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary">
          <Inbox className="h-8 w-8" />
        </span>
        <h3 className="mt-5 text-xl font-semibold">No applicants yet</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          When students apply to your approved tuitions, they will appear here
          for you to review.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/dashboard/tutor/my-tuitions">View My Tuitions</Link>
        </Button>
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
            placeholder="Search student or tuition"
            className="h-10 w-full rounded-full border bg-card pl-10 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="mt-6 rounded-2xl border bg-card p-10 text-center text-muted-foreground">
          No applicants match your search or filter.
        </p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-6 hidden overflow-hidden rounded-2xl border bg-card shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] text-sm">
                <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Student</th>
                    <th className="px-5 py-3 font-semibold">Phone</th>
                    <th className="px-5 py-3 font-semibold">Tuition</th>
                    <th className="px-5 py-3 font-semibold">Schedule</th>
                    <th className="px-5 py-3 font-semibold">Note</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {shown.map((item) => (
                    <tr key={item._id} className="transition hover:bg-muted/40">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <StudentAvatar
                            name={item.studentName}
                            image={item.studentImage}
                          />
                          <div className="min-w-0">
                            <p className="font-medium">{item.studentName}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.studentEmail}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        {item.studentPhone}
                      </td>

                      <td className="max-w-[200px] px-5 py-4">
                        <p className="line-clamp-2 font-medium">
                          {item.tuitionTitle}
                        </p>
                      </td>

                      <td className="max-w-[160px] px-5 py-4 text-muted-foreground">
                        <p className="line-clamp-2">{item.preferredSchedule}</p>
                      </td>

                      <td className="max-w-[220px] px-5 py-4">
                        <p className="line-clamp-2 text-muted-foreground">
                          {item.studentNote}
                        </p>
                        <button
                          type="button"
                          onClick={() => setDetailTarget(item)}
                          className="mt-1 text-xs font-medium text-primary hover:underline"
                        >
                          Read full note
                        </button>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={item.status} />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          {renderDecisionButtons(item)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile and tablet cards */}
          <div className="mt-6 space-y-4 lg:hidden">
            {shown.map((item) => (
              <div
                key={item._id}
                className="rounded-2xl border bg-card p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <StudentAvatar
                      name={item.studentName}
                      image={item.studentImage}
                    />
                    <div className="min-w-0">
                      <p className="truncate font-semibold">
                        {item.studentName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {item.studentEmail}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                  <p>
                    Tuition:{" "}
                    <span className="font-medium text-foreground">
                      {item.tuitionTitle}
                    </span>
                  </p>
                  <p>Phone: {item.studentPhone}</p>
                  <p>Schedule: {item.preferredSchedule}</p>
                  <p className="line-clamp-2">Note: {item.studentNote}</p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setDetailTarget(item)}
                    className="flex items-center gap-1 text-sm font-medium text-primary"
                  >
                    <Eye className="h-4 w-4" />
                    Details
                  </button>

                  {renderDecisionButtons(item)}
                </div>
              </div>
            ))}
          </div>
        </>
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {detailTarget && (
            <>
              <DialogHeader>
                <DialogTitle>Applicant details</DialogTitle>
                <DialogDescription>{detailTarget.tuitionTitle}</DialogDescription>
              </DialogHeader>

              <div className="flex items-center gap-4">
                <StudentAvatar
                  name={detailTarget.studentName}
                  image={detailTarget.studentImage}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{detailTarget.studentName}</p>
                  <StatusBadge status={detailTarget.status} />
                </div>
              </div>

              <div className="space-y-3 rounded-2xl bg-muted/60 p-4 text-sm">
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  {detailTarget.studentEmail}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <a
                    href={"tel:" + detailTarget.studentPhone}
                    className="hover:text-primary hover:underline"
                  >
                    {detailTarget.studentPhone}
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  {detailTarget.preferredSchedule}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold">Learning note</p>
                <p className="mt-2 whitespace-pre-line rounded-2xl border p-4 text-sm leading-relaxed text-muted-foreground">
                  {detailTarget.studentNote}
                </p>
              </div>

              <p className="text-xs text-muted-foreground">
                Applied on {formatDate(detailTarget.appliedAt)}
              </p>

              <div className="flex justify-end">
                {renderDecisionButtons(detailTarget)}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}