import { Suspense } from "react";
import PageHeader from "@/components/shared/PageHeader";
import TuitionsContent from "@/components/tuitions/TuitionsContent";
import type { TuitionSearchParams } from "@/components/tuitions/TuitionsContent";
import TuitionCardSkeleton from "@/components/shared/TuitionCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Browse Tuitions | MentorLagbe",
};

function TuitionsLoading() {
  const items = [1, 2, 3, 4, 5, 6];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Skeleton className="h-40 w-full rounded-2xl" />

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <TuitionCardSkeleton key={item} />
        ))}
      </div>
    </div>
  );
}

export default function TuitionsPage({
  searchParams,
}: {
  searchParams: Promise<TuitionSearchParams>;
}) {
  return (
    <div>
      <PageHeader
        eyebrow="Browse Tuitions"
        title="Find the perfect tuition for you"
        subtitle="Search and filter admin approved tuitions by subject, class level and mode."
      />

      <Suspense fallback={<TuitionsLoading />}>
        <TuitionsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}