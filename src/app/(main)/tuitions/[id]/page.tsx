import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  GraduationCap,
  CalendarDays,
  MapPin,
  Laptop,
  BookOpen,
  ShieldCheck,
  Layers,
} from "lucide-react";
import { publicFetch } from "@/lib/api";
import type { TuitionDetailsResponse } from "@/types";
import ApplyCard from "@/components/tuitions/ApplyCard";
import ReviewsSection from "@/components/tuitions/ReviewsSection";
import BookmarkButton from "@/components/shared/BookmarkButton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

async function TuitionDetailsContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  let data: TuitionDetailsResponse | null = null;
  let isNotFound = false;
  let hasError = false;

  try {
    data = await publicFetch<TuitionDetailsResponse>("/api/tuitions/" + id);
  } catch (error) {
    const err = error as Error;
    if (err.message === "Tuition not found") {
      isNotFound = true;
    } else {
      hasError = true;
    }
  }

  if (isNotFound) {
    notFound();
  }

  if (hasError || !data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">Could not load this tuition</h1>
        <p className="mt-2 text-muted-foreground">
          Please try again in a moment.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/tuitions">Back to Tuitions</Link>
        </Button>
      </div>
    );
  }

  const tuition = data.tuition;
  const tutor = data.tutor;

  const postedDate = new Date(tuition.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  let tutorBio = "This tutor has not added a bio yet.";
  if (tutor.bio !== "") {
    tutorBio = tutor.bio;
  }

  const tutorInitial = tutor.name.charAt(0).toUpperCase();
  const isVerified = tutor.plan === "pro";

  let tutorCountText = tutor.totalTuitions + " active tuitions";
  if (tutor.totalTuitions === 1) {
    tutorCountText = "1 active tuition";
  }

  const infoItems = [
    { label: "Subject", value: tuition.subject, icon: BookOpen },
    { label: "Class Level", value: tuition.classLevel, icon: GraduationCap },
    {
      label: "Schedule",
      value: tuition.daysPerWeek + " days / week",
      icon: CalendarDays,
    },
    { label: "Mode", value: tuition.mode, icon: Laptop },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Button asChild variant="ghost" className="mb-4 -ml-3 rounded-full">
        <Link href="/tuitions">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tuitions
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: main content */}
        <div className="space-y-8 lg:col-span-2">
          {/* Banner */}
          <div className="relative h-64 overflow-hidden rounded-3xl bg-secondary sm:h-80">
            <div className="absolute inset-0 flex items-center justify-center text-primary/30">
              <BookOpen className="h-16 w-16" />
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tuition.bannerImage}
              alt={tuition.title}
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <div className="absolute right-4 top-4">
              <BookmarkButton tuitionId={tuition._id} variant="full" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-3xl font-semibold md:text-4xl">
              {tuition.title}
            </h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              {tuition.location}
              <span className="text-border">|</span>
              Posted on {postedDate}
            </p>
          </div>

          {/* Info tiles */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {infoItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-2xl border bg-card p-4"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold">{item.value}</p>
                </div>
              );
            })}
          </div>

          {/* Description */}
          <div className="rounded-3xl border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-semibold">About this tuition</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">
              {tuition.description}
            </p>
          </div>
          {/* Student reviews */}
          <ReviewsSection reviews={data.reviews} rating={data.rating} />
          
          {/* Tutor profile */}
          <div className="rounded-3xl border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-semibold">Meet your tutor</h2>

            <div className="mt-5 flex items-start gap-4">
              {tutor.image !== "" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={tutor.image}
                  alt={tutor.name}
                  className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                />
              ) : (
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
                  {tutorInitial}
                </span>
              )}

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-heading text-lg font-semibold">
                    {tutor.name}
                  </h3>
                  {isVerified && (
                    <span className="flex items-center gap-1 rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-semibold text-accent-foreground dark:text-accent">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verified Pro
                    </span>
                  )}
                </div>

                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Layers className="h-4 w-4 text-primary" />
                  {tutorCountText}
                </p>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {tutorBio}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: apply card */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-28">
            <ApplyCard
              tuitionId={tuition._id}
              tuitionTitle={tuition.title}
              monthlyFee={tuition.monthlyFee}
              daysPerWeek={tuition.daysPerWeek}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

function TuitionDetailsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Skeleton className="h-9 w-40" />

      <div className="mt-4 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-80 w-full rounded-3xl" />
          <Skeleton className="h-10 w-3/4" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
          </div>
          <Skeleton className="h-48 w-full rounded-3xl" />
        </div>

        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    </div>
  );
}

export default function TuitionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<TuitionDetailsLoading />}>
      <TuitionDetailsContent params={params} />
    </Suspense>
  );
}
