"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, X, BookOpen, GraduationCap, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import FilterSelect from "@/components/tuitions/FilterSelect";
import {
  subjectOptions,
  classLevelOptions,
  modeOptions,
} from "@/lib/constants";

type TuitionFiltersProps = {
  search: string;
  subject: string;
  classLevel: string;
  mode: string;
};

export default function TuitionFilters({
  search,
  subject,
  classLevel,
  mode,
}: TuitionFiltersProps) {
  const router = useRouter();
  const [searchText, setSearchText] = useState(search);

  const hasFilters =
    search !== "" || subject !== "" || classLevel !== "" || mode !== "";

  // notun filter diye URL toiri kore sheikhane jabe
  function goTo(
    newSearch: string,
    newSubject: string,
    newClassLevel: string,
    newMode: string
  ) {
    const params = new URLSearchParams();

    if (newSearch.trim() !== "") {
      params.set("search", newSearch.trim());
    }
    if (newSubject !== "") {
      params.set("subject", newSubject);
    }
    if (newClassLevel !== "") {
      params.set("classLevel", newClassLevel);
    }
    if (newMode !== "") {
      params.set("mode", newMode);
    }

    const query = params.toString();

    if (query === "") {
      router.push("/tuitions", { scroll: false });
    } else {
      router.push("/tuitions?" + query, { scroll: false });
    }
  }

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    goTo(searchText, subject, classLevel, mode);
  }

  function handleSubjectChange(value: string) {
    goTo(searchText, value, classLevel, mode);
  }

  function handleClassLevelChange(value: string) {
    goTo(searchText, subject, value, mode);
  }

  function handleModeChange(value: string) {
    goTo(searchText, subject, classLevel, value);
  }

  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by title or subject"
            className="h-11 w-full rounded-xl border bg-background pl-10 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
          />
        </div>
        <Button type="submit" className="h-11 rounded-xl px-6">
          Search
        </Button>
      </form>

      {/* Filters */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <FilterSelect
          value={subject}
          onChange={handleSubjectChange}
          allLabel="All Subjects"
          options={subjectOptions}
          icon={BookOpen}
        />

        <FilterSelect
          value={classLevel}
          onChange={handleClassLevelChange}
          allLabel="All Class Levels"
          options={classLevelOptions}
          icon={GraduationCap}
        />

        <FilterSelect
          value={mode}
          onChange={handleModeChange}
          allLabel="Online and Offline"
          options={modeOptions}
          icon={Laptop}
        />

        {hasFilters ? (
          <Button asChild variant="outline" className="h-11 rounded-xl">
            <Link href="/tuitions">
              <X className="mr-2 h-4 w-4" />
              Clear Filters
            </Link>
          </Button>
        ) : (
          <div className="hidden h-11 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground lg:flex">
            No filters applied
          </div>
        )}
      </div>
    </div>
  );
}