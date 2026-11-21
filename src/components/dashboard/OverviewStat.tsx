"use client";

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import AnimatedCounter from "@/components/shared/AnimatedCounter";

type OverviewStatProps = {
  label: string;
  value: number | string;
  sub: string;
  icon: LucideIcon;
  gradient: string;
  index: number;
  children?: React.ReactNode;
};

export default function OverviewStat({
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

      <p className="relative mt-1 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        {typeof value === "number" ? <AnimatedCounter value={value} /> : value}
      </p>

      <p className="relative mt-2 text-xs text-muted-foreground">{sub}</p>

      {children}
    </motion.div>
  );
}