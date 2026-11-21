import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  page: number;
  totalPages: number;
  baseQuery: string;
};

export default function Pagination({
  page,
  totalPages,
  baseQuery,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  // page number diye link toiri. Filter thakle seta o link e thakbe
  function makeHref(pageNumber: number) {
    let query = "";
    if (baseQuery !== "") {
      query = baseQuery + "&";
    }
    return "/tuitions?" + query + "page=" + pageNumber + "#tuition-results";
  }

  // Kon kon page number dekhabo (prothom, shesh ar current er pashe)
  const items: (number | string)[] = [];
  let lastAdded = 0;

  for (let i = 1; i <= totalPages; i++) {
    const isFirst = i === 1;
    const isLast = i === totalPages;
    const isNearCurrent = Math.abs(i - page) <= 1;

    if (isFirst || isLast || isNearCurrent) {
      if (i - lastAdded > 1) {
        items.push("dots-" + i);
      }
      items.push(i);
      lastAdded = i;
    }
  }

  const buttonBase =
    "flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-medium transition";

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <div className="mt-12">
      <nav
        aria-label="Pagination"
        className="flex flex-wrap items-center justify-center gap-2"
      >
        {/* Previous */}
        {prevDisabled ? (
          <span
            className={buttonBase + " cursor-not-allowed gap-1 opacity-40"}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </span>
        ) : (
          <Link
            href={makeHref(page - 1)}
            className={buttonBase + " gap-1 bg-card hover:bg-secondary"}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </Link>
        )}

        {/* Page numbers */}
        {items.map((item) => {
          if (typeof item === "string") {
            return (
              <span key={item} className="px-1 text-muted-foreground">
                ...
              </span>
            );
          }

          if (item === page) {
            return (
              <span
                key={item}
                aria-current="page"
                className={
                  buttonBase +
                  " border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25"
                }
              >
                {item}
              </span>
            );
          }

          return (
            <Link
              key={item}
              href={makeHref(item)}
              className={buttonBase + " bg-card hover:bg-secondary"}
            >
              {item}
            </Link>
          );
        })}

        {/* Next */}
        {nextDisabled ? (
          <span
            className={buttonBase + " cursor-not-allowed gap-1 opacity-40"}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </span>
        ) : (
          <Link
            href={makeHref(page + 1)}
            className={buttonBase + " gap-1 bg-card hover:bg-secondary"}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </nav>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>
    </div>
  );
}