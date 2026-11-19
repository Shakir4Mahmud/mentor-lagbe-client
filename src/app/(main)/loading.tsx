import { Skeleton } from "@/components/ui/skeleton";
import TuitionCardSkeleton from "@/components/shared/TuitionCardSkeleton";

export default function MainLoading() {
  const items = [1, 2, 3, 4, 5, 6];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="space-y-3">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <TuitionCardSkeleton key={item} />
        ))}
      </div>
    </div>
  );
}