"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  BookOpen,
  GraduationCap,
  CalendarDays,
  MapPin,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BookmarkButton from "@/components/shared/BookmarkButton";
import type { Tuition } from "@/types";

type TuitionCardProps = {
  tuition: Tuition;
  index?: number;
};

export default function TuitionCard({ tuition, index = 0 }: TuitionCardProps) {
  let modeClass =
    "absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold shadow ";
  if (tuition.mode === "Online") {
    modeClass = modeClass + "bg-primary text-primary-foreground";
  } else {
    modeClass = modeClass + "bg-accent text-accent-foreground";
  }

  const tutorInitial = tuition.tutorName.charAt(0).toUpperCase();
  const delay = (index % 3) * 0.1;

  // -1 mane ei list e rating er data ashe ni (jemon Saved page)
  let ratingCount = -1;
  if (tuition.ratingCount !== undefined) {
    ratingCount = tuition.ratingCount;
  }

  let ratingAverage = 0;
  if (tuition.ratingAverage !== undefined) {
    ratingAverage = tuition.ratingAverage;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
    >
      {/* Banner image */}
      <div className="relative h-44 w-full shrink-0 overflow-hidden bg-secondary">
        <div className="absolute inset-0 flex items-center justify-center text-primary/30">
          <BookOpen className="h-12 w-12" />
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tuition.bannerImage}
          alt={tuition.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />

        <span className={modeClass}>{tuition.mode}</span>

        <div className="absolute right-3 top-3">
          <BookmarkButton tuitionId={tuition._id} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          {tuition.subject}
        </p>

        <h3 className="mt-1 line-clamp-2 min-h-[3.5rem] font-heading text-lg font-semibold leading-snug">
          {tuition.title}
        </h3>

        <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 shrink-0 text-primary" />
            {tuition.classLevel}
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
            {tuition.daysPerWeek} days / week
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <span className="line-clamp-1">{tuition.location}</span>
          </div>
        </div>

        {/* Tutor ar rating */}
        <div className="mt-4 flex items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-primary">
            {tutorInitial}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-medium">
            {tuition.tutorName}
          </span>

          {ratingCount > 0 && (
            <span className="flex shrink-0 items-center gap-1 text-sm font-semibold">
              <Star className="h-4 w-4 fill-accent text-accent" />
              {ratingAverage.toFixed(1)}
              <span className="font-normal text-muted-foreground">
                ({ratingCount})
              </span>
            </span>
          )}

          {ratingCount === 0 && (
            <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-primary">
              New
            </span>
          )}
        </div>

        {/* Fee and button (shob somoy niche) */}
        <div className="mt-auto flex items-center justify-between border-t pt-4">
          <div>
            <p className="text-xs text-muted-foreground">Monthly fee</p>
            <p className="text-lg font-bold text-primary">
              {tuition.monthlyFee.toLocaleString("en-US")} BDT
            </p>
          </div>

          <Button asChild size="sm" className="rounded-full">
            <Link href={"/tuitions/" + tuition._id}>View Details</Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}