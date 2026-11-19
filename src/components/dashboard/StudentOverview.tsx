"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FileText,
  CheckCircle2,
  Clock,
  Crown,
  ArrowRight,
  Compass,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { Application, StudentStats } from "@/types";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentOverview() {
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [recent, setRecent] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const statsData = await apiFetch<StudentStats>(
          "/api/applications/stats"
        );
        const listData = await apiFetch<{ applications: Application[] }>(
          "/api/applications/my"
        );

        setStats(statsData);
        setRecent(listData.applications.slice(0, 3));
      } catch {
        setHasError(true);
      }
      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) {
    const items = [1, 2, 3, 4];

    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <Skeleton key={item} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (hasError || !stats) {
    return (
      <p className="rounded-2xl border bg-card p-10 text-center text-muted-foreground">
        Could not load your dashboard. Please refresh the page.
      </p>
    );
  }

  const isPro = stats.plan === "pro";

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Applied"
          value={stats.total}
          icon={FileText}
          color="primary"
          index={0}
        />
        <StatCard
          label="Accepted"
          value={stats.accepted}
          icon={CheckCircle2}
          color="emerald"
          index={1}
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          icon={Clock}
          color="amber"
          index={2}
        />
        <StatCard
          label="Current Plan"
          value={isPro ? "Pro" : "Free"}
          icon={Crown}
          color="gold"
          index={3}
        />
      </div>

      {/* Recent applications */}
      <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent applications</h2>

          {recent.length > 0 && (
            <Button asChild variant="ghost" size="sm" className="rounded-full">
              <Link href="/dashboard/student/my-applications">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        {recent.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary">
              <Compass className="h-7 w-7" />
            </span>
            <p className="mt-4 font-medium">You have not applied yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Find a tuition you like and send your first application.
            </p>
            <Button asChild className="mt-5 rounded-full">
              <Link href="/tuitions">Browse Tuitions</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-4 divide-y">
            {recent.map((item) => {
              const date = new Date(item.appliedAt).toLocaleDateString(
                "en-US",
                { year: "numeric", month: "short", day: "numeric" }
              );

              return (
                <div
                  key={item._id}
                  className="flex flex-wrap items-center justify-between gap-3 py-4"
                >
                  <div className="min-w-0">
                    <Link
                      href={"/tuitions/" + item.tuitionId}
                      className="line-clamp-1 font-medium hover:text-primary"
                    >
                      {item.tuitionTitle}
                    </Link>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {item.tutorName} · Applied on {date}
                    </p>
                  </div>

                  <StatusBadge status={item.status} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}