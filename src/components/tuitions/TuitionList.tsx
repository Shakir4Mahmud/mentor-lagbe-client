"use client";

import { useState } from "react";
import { ChevronDown, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { publicFetch } from "@/lib/api";
import type { Tuition, TuitionListResponse } from "@/types";
import TuitionCard from "@/components/shared/TuitionCard";
import { Button } from "@/components/ui/button";

type TuitionListProps = {
  initialTuitions: Tuition[];
  total: number;
  baseQuery: string;
};

const pageSize = 9;

export default function TuitionList({
  initialTuitions,
  total,
  baseQuery,
}: TuitionListProps) {
  const [tuitions, setTuitions] = useState<Tuition[]>(initialTuitions);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const remaining = total - tuitions.length;

  async function handleSeeMore() {
    setLoading(true);

    const nextPage = page + 1;

    const params = new URLSearchParams(baseQuery);
    params.set("page", String(nextPage));
    params.set("limit", String(pageSize));

    try {
      const data = await publicFetch<TuitionListResponse>(
        "/api/tuitions?" + params.toString()
      );

      const allTuitions = tuitions.concat(data.tuitions);
      setTuitions(allTuitions);
      setPage(nextPage);
    } catch {
      toast.error("Could not load more tuitions. Please try again.");
    }

    setLoading(false);
  }

  return (
    <>
      <p className="mt-8 text-sm text-muted-foreground">
        Showing {tuitions.length} of {total} tuitions
      </p>

      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tuitions.map((tuition, index) => (
          <TuitionCard key={tuition._id} tuition={tuition} index={index} />
        ))}
      </div>

      {/* See More button */}
      {remaining > 0 && (
        <div className="mt-12 text-center">
          <Button
            onClick={handleSeeMore}
            disabled={loading}
            variant="outline"
            size="lg"
            className="rounded-full px-8"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ChevronDown className="mr-2 h-4 w-4" />
            )}
            {loading ? "Loading..." : "See More (" + remaining + " left)"}
          </Button>
        </div>
      )}

      {/* Shob dekha shesh */}
      {remaining <= 0 && total > pageSize && (
        <p className="mt-12 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          You have seen all tuitions
        </p>
      )}
    </>
  );
}