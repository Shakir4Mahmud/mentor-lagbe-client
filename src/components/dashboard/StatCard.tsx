"use client";

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import AnimatedCounter from "@/components/shared/AnimatedCounter";

type StatCardProps = {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color?: "primary" | "emerald" | "amber" | "rose" | "gold";
  index?: number;
};

const colorClasses = {
  primary: "bg-primary/10 text-primary",
  emerald: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  rose: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  gold: "bg-accent/20 text-accent-foreground dark:text-accent",
};

export default function StatCard({
  label,
  value,
  icon,
  color = "primary",
  index = 0,
}: StatCardProps) {
  const Icon = icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span
          className={
            "flex h-10 w-10 items-center justify-center rounded-xl " +
            colorClasses[color]
          }
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>

      <p className="mt-3 font-heading text-3xl font-bold">
        {typeof value === "number" ? <AnimatedCounter value={value} /> : value}
      </p>
    </motion.div>
  );
}