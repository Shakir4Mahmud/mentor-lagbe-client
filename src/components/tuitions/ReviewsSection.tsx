"use client";

import { useState } from "react";
import { MessageSquareText, Star } from "lucide-react";
import type { RatingSummary, Review } from "@/types";
import { StarDisplay } from "@/components/shared/StarRating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type ReviewsSectionProps = {
  reviews: Review[];
  rating: RatingSummary;
};

// Prothome koyta review dekhabo
const firstCount = 4;

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ReviewsSection({
  reviews,
  rating,
}: ReviewsSectionProps) {
  const [showAll, setShowAll] = useState(false);

  let visibleReviews = reviews;
  if (!showAll) {
    visibleReviews = reviews.slice(0, firstCount);
  }

  // 5 theke 1 star porjonto bar er jonno
  const starRows = [5, 4, 3, 2, 1];

  return (
    <div className="rounded-3xl border bg-card p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Student reviews</h2>
        {rating.count > 0 && (
          <span className="text-sm text-muted-foreground">
            {rating.count} {rating.count === 1 ? "review" : "reviews"}
          </span>
        )}
      </div>

      {rating.count === 0 ? (
        <div className="flex flex-col items-center py-10 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary">
            <MessageSquareText className="h-7 w-7" />
          </span>
          <p className="mt-4 font-medium">No reviews yet</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Students whose application was accepted can rate this tuition and
            share their experience.
          </p>
        </div>
      ) : (
        <>
          {/* Average ar star bar */}
          <div className="mt-6 grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
            <div className="rounded-2xl bg-secondary/60 p-5 text-center">
              <p className="font-heading text-5xl font-bold text-primary">
                {rating.average.toFixed(1)}
              </p>
              <div className="mt-2 flex justify-center">
                <StarDisplay value={rating.average} size={20} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">out of 5</p>
            </div>

            <div className="space-y-2">
              {starRows.map((star) => {
                const count = rating.distribution[star - 1];

                let percent = 0;
                if (rating.count > 0) {
                  percent = (count / rating.count) * 100;
                }

                return (
                  <div key={star} className="flex items-center gap-3 text-sm">
                    <span className="flex w-8 shrink-0 items-center gap-1 font-medium">
                      {star}
                      <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                    </span>

                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: percent + "%" }}
                      />
                    </div>

                    <span className="w-6 shrink-0 text-right text-muted-foreground">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review list */}
          <div className="mt-8 space-y-4">
            {visibleReviews.map((item) => (
              <div key={item._id} className="rounded-2xl border bg-background/60 p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={item.studentImage} alt={item.studentName} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {item.studentName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold">
                        {item.studentName}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.reviewedAt)}
                      </span>
                    </div>

                    <div className="mt-1">
                      <StarDisplay value={item.rating} size={14} />
                    </div>

                    <p className="mt-2 whitespace-pre-line break-words text-sm leading-relaxed text-muted-foreground">
                      {item.review}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {reviews.length > firstCount && (
            <div className="mt-5 text-center">
              <Button
                variant="outline"
                onClick={() => setShowAll(!showAll)}
                className="rounded-full"
              >
                {showAll
                  ? "Show fewer reviews"
                  : "Show all " + reviews.length + " reviews"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}