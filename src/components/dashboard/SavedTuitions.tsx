"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HeartOff } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useSaved } from "@/components/providers/SavedProvider";
import type { Tuition } from "@/types";
import TuitionCard from "@/components/shared/TuitionCard";
import TuitionCardSkeleton from "@/components/shared/TuitionCardSkeleton";
import { Button } from "@/components/ui/button";

export default function SavedTuitions() {
  const { savedIds, idsLoaded } = useSaved();

  const [allTuitions, setAllTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTuitions() {
      try {
        const data = await apiFetch<{ tuitions: Tuition[] }>(
          "/api/bookmarks/tuitions"
        );
        setAllTuitions(data.tuitions);
      } catch {
        toast.error("Could not load saved tuitions");
      }
      setLoading(false);
    }

    loadTuitions();
  }, []);

  // Heart chaple card sathe sathe soriye jabe
  const shown = allTuitions.filter((tuition) => savedIds.includes(tuition._id));

  if (loading || !idsLoaded) {
    const items = [1, 2, 3];

    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <TuitionCardSkeleton key={item} />
        ))}
      </div>
    );
  }

  if (shown.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border bg-card px-6 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary">
          <HeartOff className="h-8 w-8" />
        </span>
        <h3 className="mt-5 text-xl font-semibold">No saved tuitions yet</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Tap the heart on any tuition to save it here for later.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/tuitions">Browse Tuitions</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <p className="mb-4 text-sm text-muted-foreground">
        {shown.length} saved {shown.length === 1 ? "tuition" : "tuitions"}
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((tuition, index) => (
          <TuitionCard key={tuition._id} tuition={tuition} index={index} />
        ))}
      </div>
    </>
  );
}