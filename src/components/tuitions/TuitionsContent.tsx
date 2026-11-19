import Link from "next/link";
import { SearchX } from "lucide-react";
import { publicFetch } from "@/lib/api";
import type { TuitionListResponse } from "@/types";
import TuitionFilters from "@/components/tuitions/TuitionFilters";
import TuitionList from "@/components/tuitions/TuitionList";
import { Button } from "@/components/ui/button";

export type TuitionSearchParams = {
  search?: string;
  subject?: string;
  classLevel?: string;
  mode?: string;
};

type TuitionsContentProps = {
  searchParams: Promise<TuitionSearchParams>;
};

export default async function TuitionsContent({
  searchParams,
}: TuitionsContentProps) {
  const params = await searchParams;

  // URL theke filter value gulo nibo
  let search = "";
  if (params.search) {
    search = params.search;
  }

  let subject = "";
  if (params.subject) {
    subject = params.subject;
  }

  let classLevel = "";
  if (params.classLevel) {
    classLevel = params.classLevel;
  }

  let mode = "";
  if (params.mode) {
    mode = params.mode;
  }

  // Filter er query, See More button e lagbe
  const baseParams = new URLSearchParams();
  if (search !== "") {
    baseParams.set("search", search);
  }
  if (subject !== "") {
    baseParams.set("subject", subject);
  }
  if (classLevel !== "") {
    baseParams.set("classLevel", classLevel);
  }
  if (mode !== "") {
    baseParams.set("mode", mode);
  }
  const baseQuery = baseParams.toString();

  // Duto component er key alada rakhlam jate ek na hoy
  const filtersKey = "filters-" + baseQuery;
  const listKey = "list-" + baseQuery;

  // Prothom 9 ta tuition server theke
  const apiParams = new URLSearchParams(baseQuery);
  apiParams.set("page", "1");
  apiParams.set("limit", "9");

  let data: TuitionListResponse | null = null;
  let hasError = false;

  try {
    data = await publicFetch<TuitionListResponse>(
      "/api/tuitions?" + apiParams.toString()
    );
  } catch {
    hasError = true;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <TuitionFilters
        key={filtersKey}
        search={search}
        subject={subject}
        classLevel={classLevel}
        mode={mode}
      />

      {hasError && (
        <p className="mt-10 rounded-2xl border bg-card p-10 text-center text-muted-foreground">
          Could not load tuitions right now. Please try again later.
        </p>
      )}

      {data && data.tuitions.length === 0 && (
        <div className="mt-10 flex flex-col items-center rounded-2xl border bg-card px-6 py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary">
            <SearchX className="h-8 w-8" />
          </span>
          <h3 className="mt-5 text-xl font-semibold">No tuitions found</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            We could not find any tuition for these filters. Try a different
            search or clear the filters.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link href="/tuitions">Clear Filters</Link>
          </Button>
        </div>
      )}

      {data && data.tuitions.length > 0 && (
        <TuitionList
          key={listKey}
          initialTuitions={data.tuitions}
          total={data.total}
          baseQuery={baseQuery}
        />
      )}
    </div>
  );
}