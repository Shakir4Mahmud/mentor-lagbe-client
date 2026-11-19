import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { publicFetch } from "@/lib/api";
import type { Tuition } from "@/types";
import SectionHeading from "@/components/shared/SectionHeading";
import TuitionCard from "@/components/shared/TuitionCard";
import TuitionCardSkeleton from "@/components/shared/TuitionCardSkeleton";
import { Button } from "@/components/ui/button";

async function FeaturedTuitions() {
  let tuitions: Tuition[] = [];
  let hasError = false;

  try {
    const data = await publicFetch<{ tuitions: Tuition[] }>(
      "/api/tuitions?limit=6"
    );
    tuitions = data.tuitions;
  } catch {
    hasError = true;
  }

  if (hasError) {
    return (
      <p className="rounded-2xl border bg-card p-10 text-center text-muted-foreground">
        Could not load tuitions right now. Please try again later.
      </p>
    );
  }

  if (tuitions.length === 0) {
    return (
      <p className="rounded-2xl border bg-card p-10 text-center text-muted-foreground">
        No tuitions available yet.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tuitions.map((tuition, index) => (
        <TuitionCard key={tuition._id} tuition={tuition} index={index} />
      ))}
    </div>
  );
}

function FeaturedLoading() {
  const items = [1, 2, 3, 4, 5, 6];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <TuitionCardSkeleton key={item} />
      ))}
    </div>
  );
}

export default function FeaturedSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading
        eyebrow="Featured Tuitions"
        title="Latest tuitions picked for you"
        subtitle="Fresh, admin approved tuition batches and one to one mentorship from verified tutors."
      />

      <div className="mt-12">
        <Suspense fallback={<FeaturedLoading />}>
          <FeaturedTuitions />
        </Suspense>
      </div>

      <div className="mt-12 text-center">
        <Button asChild variant="outline" size="lg" className="rounded-full">
          <Link href="/tuitions">
            View All Tuitions
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}