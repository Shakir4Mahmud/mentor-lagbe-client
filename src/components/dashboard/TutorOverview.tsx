"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Crown,
  Inbox,
  PlusCircle,
  Rocket,
  Sparkles,
  TrendingUp,
  Trophy,
  Users,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import type { TutorStats } from "@/types";
import AnimatedCounter from "@/components/shared/AnimatedCounter";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// ===== Chart er helper =====

const chartWidth = 600;
const chartHeight = 200;
const chartPadTop = 24;
const chartPadBottom = 12;

type ChartPoint = {
  x: number;
  y: number;
};

function getPoints(values: number[]) {
  // sob value 0 hole line niche e thakbe, tai max kom pokkhe 3
  let maxValue = 3;
  for (let i = 0; i < values.length; i++) {
    if (values[i] > maxValue) {
      maxValue = values[i];
    }
  }

  const points: ChartPoint[] = [];
  const stepX = chartWidth / (values.length - 1);
  const usableHeight = chartHeight - chartPadTop - chartPadBottom;

  for (let i = 0; i < values.length; i++) {
    const x = i * stepX;
    const y =
      chartHeight - chartPadBottom - (values[i] / maxValue) * usableHeight;
    points.push({ x: x, y: y });
  }

  return points;
}

// Smooth curve line er path
function buildLinePath(points: ChartPoint[]) {
  let path = "M " + points[0].x + "," + points[0].y;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const current = points[i];
    const midX = (prev.x + current.x) / 2;

    path =
      path +
      " C " +
      midX +
      "," +
      prev.y +
      " " +
      midX +
      "," +
      current.y +
      " " +
      current.x +
      "," +
      current.y;
  }

  return path;
}

function buildAreaPath(points: ChartPoint[]) {
  const linePath = buildLinePath(points);
  const last = points[points.length - 1];

  return (
    linePath + " L " + last.x + "," + chartHeight + " L 0," + chartHeight + " Z"
  );
}

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

// ===== Chhoto component gulo =====

type OverviewStatProps = {
  label: string;
  value: number | string;
  sub: string;
  icon: LucideIcon;
  gradient: string;
  index: number;
  children?: React.ReactNode;
};

function OverviewStat({
  label,
  value,
  sub,
  icon,
  gradient,
  index,
  children,
}: OverviewStatProps) {
  const Icon = icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-3xl border bg-card p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
    >
      <div
        className={
          "absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-20 blur-xl transition duration-300 group-hover:opacity-40 " +
          gradient
        }
      />

      <div
        className={
          "relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg " +
          gradient
        }
      >
        <Icon className="h-5 w-5" />
      </div>

      <p className="relative mt-4 text-sm text-muted-foreground">{label}</p>

      <p className="relative mt-1 font-heading text-4xl font-bold tracking-tight">
        {typeof value === "number" ? <AnimatedCounter value={value} /> : value}
      </p>

      <p className="relative mt-2 text-xs text-muted-foreground">{sub}</p>

      {children}
    </motion.div>
  );
}

type WeeklyChartProps = {
  weekly: { date: string; count: number }[];
};

function WeeklyChart({ weekly }: WeeklyChartProps) {
  const values: number[] = [];
  let total = 0;

  for (let i = 0; i < weekly.length; i++) {
    values.push(weekly[i].count);
    total = total + weekly[i].count;
  }

  const points = getPoints(values);
  const linePath = buildLinePath(points);
  const areaPath = buildAreaPath(points);

  const gridLines = [0.25, 0.5, 0.75];

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h3 className="font-semibold">Applications this week</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            New student applications in the last 7 days
          </p>
        </div>

        <div className="text-right">
          <p className="font-heading text-3xl font-bold">{total}</p>
          <p className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            total
          </p>
        </div>
      </div>

      <div className="relative mt-6 h-52">
        <svg
          viewBox={"0 0 " + chartWidth + " " + chartHeight}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="weekFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2db5a8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#2db5a8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="weekStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2db5a8" />
              <stop offset="100%" stopColor="#e3b55f" />
            </linearGradient>
          </defs>

          {gridLines.map((line) => (
            <line
              key={line}
              x1="0"
              x2={chartWidth}
              y1={chartHeight * line}
              y2={chartHeight * line}
              strokeDasharray="4 6"
              className="stroke-border"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          <motion.path
            d={areaPath}
            fill="url(#weekFill)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />

          <motion.path
            d={linePath}
            fill="none"
            stroke="url(#weekStroke)"
            strokeWidth="3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          />
        </svg>

        {/* Dot gulo, hover korle number dekhay */}
        {points.map((point, index) => (
          <div
            key={index}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: (point.x / chartWidth) * 100 + "%",
              top: (point.y / chartHeight) * 100 + "%",
            }}
          >
            <span className="block h-3 w-3 rounded-full border-2 border-card bg-primary shadow transition group-hover:scale-150" />
            <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-lg bg-foreground px-2 py-1 text-xs font-semibold text-background opacity-0 shadow transition group-hover:opacity-100">
              {values[index]}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex justify-between">
        {weekly.map((day) => {
          const label = new Date(day.date + "T00:00:00").toLocaleDateString(
            "en-US",
            { weekday: "short" }
          );

          return (
            <span key={day.date} className="text-xs text-muted-foreground">
              {label}
            </span>
          );
        })}
      </div>

      {total === 0 && (
        <p className="mt-4 rounded-xl bg-muted p-3 text-center text-sm text-muted-foreground">
          No applications yet this week. Share your tuition to get noticed.
        </p>
      )}
    </div>
  );
}

type StatusDonutProps = {
  pending: number;
  accepted: number;
  rejected: number;
};

function StatusDonut({ pending, accepted, rejected }: StatusDonutProps) {
  const total = pending + accepted + rejected;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  const segments = [
    { label: "Pending", value: pending, color: "#f59e0b" },
    { label: "Accepted", value: accepted, color: "#10b981" },
    { label: "Rejected", value: rejected, color: "#f43f5e" },
  ];

  // Protita arc er length ar shuru kothay
  const arcs = [];
  let offset = 0;

  for (let i = 0; i < segments.length; i++) {
    let length = 0;
    if (total > 0) {
      length = (segments[i].value / total) * circumference;
    }

    arcs.push({
      label: segments[i].label,
      value: segments[i].value,
      color: segments[i].color,
      length: length,
      offset: offset,
    });

    offset = offset + length;
  }

  return (
    <div>
      <h3 className="font-semibold">Applicant status</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        How you responded so far
      </p>

      <div className="relative mx-auto mt-6 h-40 w-40">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="10"
            className="stroke-muted"
          />

          {arcs.map((arc) => {
            if (arc.length === 0) {
              return null;
            }

            return (
              <motion.circle
                key={arc.label}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={arc.color}
                strokeWidth="10"
                strokeDashoffset={-arc.offset}
                initial={{ strokeDasharray: "0 " + circumference }}
                animate={{
                  strokeDasharray:
                    arc.length + " " + (circumference - arc.length),
                }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            );
          })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-3xl font-bold">{total}</span>
          <span className="text-xs text-muted-foreground">applicants</span>
        </div>
      </div>

      <div className="mt-6 space-y-2.5">
        {arcs.map((arc) => (
          <div
            key={arc.label}
            className="flex items-center justify-between text-sm"
          >
            <span className="flex items-center gap-2 text-muted-foreground">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: arc.color }}
              />
              {arc.label}
            </span>
            <span className="font-semibold">{arc.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== Main component =====

export default function TutorOverview() {
  const { data: session } = authClient.useSession();

  const [stats, setStats] = useState<TutorStats | null>(null);
  const [greeting, setGreeting] = useState("Hello");
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await apiFetch<TutorStats>("/api/tutor/stats");
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
        Could not load your dashboard. Please refresh the page.
      </p>
    );
  }

  const isPro = stats.plan === "pro";
  const pendingApplicants = stats.applicationStatus.pending;

  let firstName = "Tutor";
  if (session && session.user && session.user.name) {
    firstName = session.user.name.split(" ")[0];
  }

  let heroMessage = "You are all caught up. Great job!";
  if (stats.totalPosted === 0) {
    heroMessage = "Post your first tuition to start receiving students.";
  } else if (pendingApplicants > 0) {
    heroMessage =
      "You have " +
      pendingApplicants +
      " pending " +
      (pendingApplicants === 1 ? "applicant" : "applicants") +
      " waiting for your reply.";
  }

  // Plan card er usage bar
  let usagePercent = 0;
  if (stats.postLimit !== null) {
    usagePercent = Math.min(100, (stats.totalPosted / stats.postLimit) * 100);
  }

  // Most popular tuition er bar er jonno
  let maxApplicants = 1;
  for (let i = 0; i < stats.topTuitions.length; i++) {
    if (stats.topTuitions[i].count > maxApplicants) {
      maxApplicants = stats.topTuitions[i].count;
    }
  }

  const heroPanels = [
    { label: "Approved", value: stats.approved, icon: CheckCircle2 },
    { label: "In review", value: stats.pending, icon: Clock },
    { label: "Rejected", value: stats.rejected, icon: XCircle },
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
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              {isPro ? "Pro Tutor" : "Free Tutor"}
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
              <Link href="/dashboard/tutor/post-tuition">
                <PlusCircle className="mr-2 h-4 w-4" />
                Post Tuition
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <Link href="/dashboard/tutor/applicants">
                <Users className="mr-2 h-4 w-4" />
                View Applicants
              </Link>
            </Button>
          </div>
        </div>

        {/* Tuition approval status */}
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
          label="Total Posted"
          value={stats.totalPosted}
          sub={stats.pending + " awaiting admin review"}
          icon={BookOpen}
          gradient="from-teal-500 to-emerald-400"
          index={0}
        />

        <OverviewStat
          label="Live Tuitions"
          value={stats.live}
          sub="Approved and visible to students"
          icon={Rocket}
          gradient="from-amber-400 to-orange-400"
          index={1}
        />

        <OverviewStat
          label="Total Applicants"
          value={stats.totalApplicants}
          sub={pendingApplicants + " need your reply"}
          icon={Users}
          gradient="from-sky-500 to-indigo-400"
          index={2}
        />

        <OverviewStat
          label="Current Plan"
          value={isPro ? "Pro" : "Free"}
          sub={
            isPro
              ? "Unlimited tuition posts"
              : stats.totalPosted +
                " of " +
                stats.postLimit +
                " free posts used"
          }
          icon={Crown}
          gradient="from-yellow-400 to-amber-500"
          index={3}
        >
          {!isPro && (
            <div className="relative mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
                initial={{ width: 0 }}
                animate={{ width: usagePercent + "%" }}
                transition={{ duration: 1, delay: 0.4 }}
              />
            </div>
          )}
        </OverviewStat>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-3xl border bg-card p-6 shadow-sm lg:col-span-2"
        >
          <WeeklyChart weekly={stats.weekly} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-3xl border bg-card p-6 shadow-sm"
        >
          <StatusDonut
            pending={stats.applicationStatus.pending}
            accepted={stats.applicationStatus.accepted}
            rejected={stats.applicationStatus.rejected}
          />
        </motion.div>
      </div>

      {/* Popular tuitions and latest applicants */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="rounded-3xl border bg-card p-6 shadow-sm"
        >
          <h3 className="flex items-center gap-2 font-semibold">
            <Trophy className="h-4 w-4 text-accent" />
            Most popular tuitions
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Ranked by number of applicants
          </p>

          {stats.topTuitions.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
                <Inbox className="h-6 w-6" />
              </span>
              <p className="mt-3 text-sm text-muted-foreground">
                No applicants yet. They will show up here.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              {stats.topTuitions.map((item, index) => {
                const percent = (item.count / maxApplicants) * 100;

                return (
                  <div key={item.title}>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary">
                          {index + 1}
                        </span>
                        <span className="truncate font-medium">
                          {item.title}
                        </span>
                      </span>
                      <span className="shrink-0 font-semibold text-primary">
                        {item.count}
                      </span>
                    </div>

                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                        initial={{ width: 0 }}
                        animate={{ width: percent + "%" }}
                        transition={{ duration: 0.9, delay: 0.4 + index * 0.1 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-3xl border bg-card p-6 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">Latest applicants</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Newest students who applied
              </p>
            </div>

            {stats.recent.length > 0 && (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="rounded-full"
              >
                <Link href="/dashboard/tutor/applicants">
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>

          {stats.recent.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
                <Users className="h-6 w-6" />
              </span>
              <p className="mt-3 text-sm text-muted-foreground">
                No applicants yet.
              </p>
            </div>
          ) : (
            <div className="mt-4 divide-y">
              {stats.recent.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 py-3.5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {item.studentName.charAt(0).toUpperCase()}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {item.studentName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.tuitionTitle} · {formatShortDate(item.appliedAt)}
                    </p>
                  </div>

                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}