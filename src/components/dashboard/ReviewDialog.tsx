"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import type { Application } from "@/types";
import { StarInput } from "@/components/shared/StarRating";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ReviewDialogProps = {
  application: Application;
  onClose: () => void;
  onSaved: (rating: number, review: string) => void;
};

export default function ReviewDialog({
  application,
  onClose,
  onSaved,
}: ReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [ratingError, setRatingError] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [saving, setSaving] = useState(false);

  function validateForm() {
    let isValid = true;

    if (rating === 0) {
      setRatingError("Please select a star rating");
      isValid = false;
    } else {
      setRatingError("");
    }

    if (review.trim().length < 10) {
      setReviewError("Please write at least 10 characters");
      isValid = false;
    } else {
      setReviewError("");
    }

    return isValid;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    setSaving(true);

    try {
      await apiFetch("/api/reviews/" + application._id, {
        method: "POST",
        body: JSON.stringify({
          rating: rating,
          review: review.trim(),
        }),
      });

      toast.success("Thank you for your review!");
      onSaved(rating, review.trim());
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    }

    setSaving(false);
  }

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open && !saving) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate this tuition</DialogTitle>
          <DialogDescription>{application.tuitionTitle}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="space-y-1">
            <Label>Your rating</Label>
            <StarInput value={rating} onChange={setRating} />
            {ratingError && (
              <p className="text-sm text-destructive">{ratingError}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="review-text">Your feedback</Label>
              <span className="text-xs text-muted-foreground">
                {review.length}/500
              </span>
            </div>
            <Textarea
              id="review-text"
              rows={5}
              maxLength={500}
              placeholder="How was the teaching, the schedule and the overall experience?"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            {reviewError && (
              <p className="text-sm text-destructive">{reviewError}</p>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Your name and review will be shown publicly on this tuition. You
            can review a tuition only once.
          </p>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="rounded-full px-8">
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {saving ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}