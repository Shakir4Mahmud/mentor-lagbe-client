"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Inbox,
  ShieldCheck,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import type { AdminStats } from "@/types";
import OverviewStat from "@/components/dashboard/OverviewStat";
import RoleBadge from "@/components/dashboard/RoleBadge";
import { AreaTrend, DonutChart, StackedBar } from "@/components/dashboard/charts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }
  if (hour < 17) {
    return "Good afternoon";
  }
  return "Good evening";
}

function formatShortDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function AdminOverview() {
  const { data: session } = authClient.useSession();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [greeting, setGreeting] = useState("Hello");
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await apiFetch<AdminStats>("/api/admin/stats");
        setStats(data);
        setGreeting(getGreeting());
      } catch {
        setHasError(true);
      }
      setLoading(false);
    }

    loadStats();
  }, []);

  if (loading) {
    const items = [1, 2, 3, 4];

    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full rounded-3xl" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <Skeleton key={item} className="h-40 rounded-3xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-80 rounded-3xl lg:col-span-2" />
          <Skeleton className="h-80 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (hasError || !stats) {
    return (
      <p className="rounded-2xl border bg-card p-10 text-center text-muted-foreground">
        Could not load admin stats. Please refresh the page.
      </p>
    );
  }

  let firstName = "Admin";
  if (session && session.user && session.user.name) {
    firstName = session.user.name.split(" ")[0];
  }

  let heroMessage = "Everything is under control. No tuitions are waiting.";
  if (stats.pending > 0) {
    heroMessage =
      stats.pending +
      " " +
      (stats.pending === 1 ? "tuition is" : "tuitions are") +
      " waiting for your approval.";
  }

  // Approved vs pending bar
  let approvedPercent = 0;
  const reviewedTotal = stats.approved + stats.pending;
  if (reviewedTotal > 0) {
    approvedPercent = (stats.approved / reviewedTotal) * 100;
  }

  const heroPanels = [
    { label: "Students", value: stats.totalStudents, icon: GraduationCap },
    { label: "Tutors", value: stats.totalTutors, icon: BookOpen },
    { label: "Admins", value: stats.totalAdmins, icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-hero-gradient p-6 text-white shadow-xl shadow-primary/20 sm:p-8"
      >
        <div className="absolute -right-16 -top-16 hidden h-64 w-64 rounded-full bg-accent/25 blur-3xl sm:block" />
        <div className="absolute -bottom-20 left-10 hidden h-56 w-56 rounded-full bg-white/10 blur-3xl sm:block" />
        <div className="absolute inset-0 opacity-15 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:26px_26px]" />

        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs backdrop-blur-none sm:backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              Platform Admin
            </span>

            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
              {greeting}, <span className="text-gold-gradient">{firstName}</span>
            </h2>

            <p className="mt-2 text-white/80">{heroMessage}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link href="/dashboard/admin/tuitions">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Review Tuitions
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <Link href="/dashboard/admin/users">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative mt-8 grid grid-cols-3 gap-3">
          {heroPanels.map((panel) => {
            const Icon = panel.icon;

            return (
              <div
                key={panel.label}
                className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-none sm:backdrop-blur"
              >
                <div className="flex items-center gap-2 text-xs text-white/75">
                  <Icon className="h-4 w-4 text-accent" />
                  {panel.label}
                </div>
                <p className="mt-2 font-heading text-2xl font-bold sm:text-3xl">
                  {panel.value}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OverviewStat
          label="Total Users"
          value={stats.totalUsers}
          sub={stats.proUsers + " on Pro plan"}
          icon={Users}
          gradient="from-teal-500 to-emerald-400"
          index={0}
        />

        <OverviewStat
          label="Total Tutors"
          value={stats.totalTutors}
          sub={stats.totalStudents + " students on the platform"}
          icon={BookOpen}
          gradient="from-sky-500 to-indigo-400"
          index={1}
        />

        <OverviewStat
          label="Approved / Pending"
          value={stats.approved + " / " + stats.pending}
          sub="Tuitions approved vs waiting"
          icon={CheckCircle2}
          gradient="from-amber-400 to-orange-400"
          index={2}
        >
          <div className="relative mt-3 h-2 w-full overflow-hidden rounded-full bg-amber-500/25">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
              initial={{ width: 0 }}
              animate={{ width: approvedPercent + "%" }}
              transition={{ duration: 1, delay: 0.4 }}
            />
          </div>
        </OverviewStat>

        <OverviewStat
          label="Total Revenue"
          value={stats.revenue.toLocaleString("en-US") + " BDT"}
          sub={stats.transactions + " Stripe transactions"}
          icon={Wallet}
          gradient="from-yellow-400 to-amber-500"
          index={3}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-3xl border bg-card p-6 shadow-sm lg:col-span-2"
        >
          <AreaTrend
            idPrefix="adminSignup"
            title="New signups this week"
            subtitle="Users who joined in the last 7 days"
            totalLabel="new users"
            emptyText="No new signups this week yet."
            data={stats.weekly}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-3xl border bg-card p-6 shadow-sm"
        >
          <DonutChart
            title="Users by role"
            subtitle="Who is using the platform"
            centerLabel="users"
            segments={[
              { label: "Students", value: stats.totalStudents, color: "#0ea5e9" },
              { label: "Tutors", value: stats.totalTutors, color: "#2db5a8" },
              { label: "Admins", value: stats.totalAdmins, color: "#f43f5e" },
            ]}
          />
        </motion.div>
      </div>

      {/* Pipeline and awaiting approval */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="rounded-3xl border bg-card p-6 shadow-sm"
        >
          <h3 className="font-semibold">Tuition pipeline</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Status of every tuition posted by tutors
          </p>

          <div className="mt-6">
            <StackedBar
              segments={[
                { label: "Approved", value: stats.approved, color: "#10b981" },
                { label: "Pending", value: stats.pending, color: "#f59e0b" },
                { label: "Rejected", value: stats.rejected, color: "#f43f5e" },
              ]}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Live on site
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-amber-500" />
              Needs review
            </span>
            <span className="flex items-center gap-1.5">
              <XCircle className="h-4 w-4 text-rose-500" />
              Declined
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-3xl border bg-card p-6 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">Awaiting approval</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Newest tuitions that need your review
              </p>
            </div>

            {stats.pendingList.length > 0 && (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="rounded-full"
              >
                <Link href="/dashboard/admin/tuitions">
                  Review
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>

          {stats.pendingList.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
                <Inbox className="h-6 w-6" />
              </span>
              <p className="mt-3 text-sm text-muted-foreground">
                Nothing is waiting. You are all caught up.
              </p>
            </div>
          ) : (
            <div className="mt-4 divide-y">
              {stats.pendingList.map((item) => (
                <div key={item._id} className="flex items-center gap-3 py-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
                    <Clock className="h-5 w-5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {item.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.tutorName} · {formatShortDate(item.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent users */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="rounded-3xl border bg-card p-6 shadow-sm"
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">Recently joined</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              The newest members of MentorLagbe
            </p>
          </div>

          <Button asChild variant="ghost" size="sm" className="rounded-full">
            <Link href="/dashboard/admin/users">
              All users
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-4 divide-y">
          {stats.recentUsers.map((item) => (
            <div key={item._id} className="flex items-center gap-3 py-3.5">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={item.image} alt={item.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {item.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{item.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {item.email}
                </p>
              </div>

              <div className="hidden text-xs text-muted-foreground sm:block">
                {formatShortDate(item.createdAt)}
              </div>

              <RoleBadge role={item.role} />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}