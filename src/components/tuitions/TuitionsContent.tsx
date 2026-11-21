import Link from "next/link";
import { redirect } from "next/navigation";
import { SearchX } from "lucide-react";
import { publicFetch } from "@/lib/api";
import type { TuitionListResponse } from "@/types";
import TuitionCard from "@/components/shared/TuitionCard";
import TuitionFilters from "@/components/tuitions/TuitionFilters";
import Pagination from "@/components/tuitions/Pagination";
import { Button } from "@/components/ui/button";

export type TuitionSearchParams = {
  search?: string;
  subject?: string;
  classLevel?: string;
  mode?: string;
  page?: string;
};

type TuitionsContentProps = {
  searchParams: Promise<TuitionSearchParams>;
};

// Prottek page e koyta card
const pageSize = 9;

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

  // Kon page, vul hole page 1
  let page = Number(params.page);
  if (isNaN(page) || page < 1) {
    page = 1;
  }

  // Filter er query (page chhara), pagination link e lagbe
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

  // Filter bar er key. Filter bodlale bar reset hoy, page bodlale hoy na
  const filtersKey = "filters-" + baseQuery;

  // Server theke ei page er tuition ani
  const apiParams = new URLSearchParams(baseQuery);
  apiParams.set("page", String(page));
  apiParams.set("limit", String(pageSize));

  let data: TuitionListResponse | null = null;
  let hasError = false;

  try {
    data = await publicFetch<TuitionListResponse>(
      "/api/tuitions?" + apiParams.toString()
    );
  } catch {
    hasError = true;
  }

  // Page number beshi dile (jemon ?page=99) page 1 e pathai
  if (data && data.totalPages > 0 && page > data.totalPages) {
    if (baseQuery === "") {
      redirect("/tuitions");
    }
    redirect("/tuitions?" + baseQuery);
  }

  // "Showing 10 to 12 of 12 tuitions" er text
  let countText = "";
  if (data && data.total > 0) {
    const from = (data.page - 1) * data.limit + 1;
    const to = from + data.tuitions.length - 1;
    countText =
      "Showing " + from + " to " + to + " of " + data.total + " tuitions";
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

      {/* Page bodlale ekhane scroll hoy */}
      <div id="tuition-results" className="scroll-mt-28" />

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
        <>
          <p className="mt-8 text-sm text-muted-foreground">{countText}</p>

          {/* key bodlale card gulo notun kore animate hoy */}
          <div
            key={"page-" + data.page}
            className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {data.tuitions.map((tuition, index) => (
              <TuitionCard key={tuition._id} tuition={tuition} index={index} />
            ))}
          </div>

          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            baseQuery={baseQuery}
          />
        </>
      )}
    </div>
  );
}