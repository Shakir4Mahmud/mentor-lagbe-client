import { Suspense } from "react";
import { publicFetch } from "@/lib/api";
import type { PublicStats } from "@/types";
import SectionHeading from "@/components/shared/SectionHeading";
import SubjectsGrid from "@/components/home/SubjectsGrid";
import StatsBand from "@/components/home/StatsBand";
import { Skeleton } from "@/components/ui/skeleton";

async function SubjectsAndStatsContent() {
  let stats: PublicStats = {
    totalTutors: 0,
    totalStudents: 0,
    totalTuitions: 0,
    totalSubjects: 0,
    subjects: [],
  };

  try {
    stats = await publicFetch<PublicStats>("/api/stats/public");
  } catch {
    // server bondho thakle 0 diye dekhabe, page bhangbe na
  }

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Top Subjects"
          title="Explore tuitions by subject"
          subtitle="From school subjects to IELTS and programming, find the right mentor for what you want to learn."
        />

        <div className="mt-12">
          <SubjectsGrid subjects={stats.subjects} />
        </div>
      </section>

      <StatsBand
        tutors={stats.totalTutors}
        students={stats.totalStudents}
        tuitions={stats.totalTuitions}
        subjects={stats.totalSubjects}
      />
    </>
  );
}

function SubjectsAndStatsLoading() {
  const items = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl space-y-3 text-center">
        <Skeleton className="mx-auto h-6 w-28 rounded-full" />
        <Skeleton className="mx-auto h-10 w-80 max-w-full" />
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {items.map((item) => (
          <Skeleton key={item} className="h-36 rounded-2xl" />
        ))}
      </div>
    </section>
  );
}

export default function SubjectsAndStats() {
  return (
    <Suspense fallback={<SubjectsAndStatsLoading />}>
      <SubjectsAndStatsContent />
    </Suspense>
  );
}