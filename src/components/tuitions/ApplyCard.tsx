"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Loader2,
  Send,
  CheckCircle2,
  Info,
  LogIn,
  CalendarDays,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ApplyCardProps = {
  tuitionId: string;
  tuitionTitle: string;
  monthlyFee: number;
  daysPerWeek: number;
};

type CheckResponse = {
  applied: boolean;
  status: string;
};

type FormErrors = {
  phone?: string;
  schedule?: string;
  note?: string;
};

export default function ApplyCard({
  tuitionId,
  tuitionTitle,
  monthlyFee,
  daysPerWeek,
}: ApplyCardProps) {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  let role = "";
  if (user && user.role) {
    role = user.role;
  }
  const isStudent = role === "student";

  const [checking, setChecking] = useState(true);
  const [applied, setApplied] = useState(false);
  const [appliedStatus, setAppliedStatus] = useState("");

  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [schedule, setSchedule] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // Student hole ager apply korechhe kina server theke dekhbo
  useEffect(() => {
    if (!isStudent) {
      return;
    }

    async function checkApplication() {
      try {
        const data = await apiFetch<CheckResponse>(
          "/api/applications/check/" + tuitionId,
        );
        setApplied(data.applied);
        setAppliedStatus(data.status);
      } catch {
        // check na hole apply button e dekhabe, server abar duplicate block korbe
      }
      setChecking(false);
    }

    checkApplication();
  }, [isStudent, tuitionId]);

  function validateForm() {
    const newErrors: FormErrors = {};
    const cleanPhone = phone.replace(/[\s-]/g, "");
    const phonePattern = /^(\+?88)?01[3-9]\d{8}$/;

    if (cleanPhone === "") {
      newErrors.phone = "Phone number is required";
    } else if (!phonePattern.test(cleanPhone)) {
      newErrors.phone = "Enter a valid phone number, for example 01712345678";
    }

    if (schedule.trim() === "") {
      newErrors.schedule = "Preferred schedule is required";
    }

    if (note.trim().length < 10) {
      newErrors.note = "Please write at least 10 characters";
    }

    setErrors(newErrors);

    const errorCount = Object.keys(newErrors).length;
    if (errorCount === 0) {
      return true;
    }
    return false;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    setSubmitting(true);

    try {
      await apiFetch("/api/applications", {
        method: "POST",
        body: JSON.stringify({
          tuitionId: tuitionId,
          studentPhone: phone.replace(/[\s-]/g, ""),
          preferredSchedule: schedule.trim(),
          studentNote: note.trim(),
        }),
      });

      toast.success("Application submitted successfully!");
      setApplied(true);
      setAppliedStatus("pending");
      setOpen(false);
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);

      if (err.message.includes("already applied")) {
        setApplied(true);
        setAppliedStatus("pending");
        setOpen(false);
      }
    }

    setSubmitting(false);
  }

  // Status badge er rong
  let statusClass = "bg-amber-500/15 text-amber-600 dark:text-amber-400";
  if (appliedStatus === "accepted") {
    statusClass = "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400";
  }
  if (appliedStatus === "rejected") {
    statusClass = "bg-rose-500/15 text-rose-600 dark:text-rose-400";
  }

  const statusLabel =
    appliedStatus.charAt(0).toUpperCase() + appliedStatus.slice(1);

  // Card er niche er action part
  let actionPart = null;

  if (isPending) {
    actionPart = <Skeleton className="h-12 w-full rounded-full" />;
  } else if (!user) {
    actionPart = (
      <Button asChild size="lg" className="w-full rounded-full">
        <Link href={"/sign-in?redirect=/tuitions/" + tuitionId}>
          <LogIn className="mr-2 h-4 w-4" />
          Sign in to Apply
        </Link>
      </Button>
    );
  } else if (!isStudent) {
    actionPart = (
      <div className="space-y-3">
        <Button size="lg" className="w-full rounded-full" disabled>
          Apply Now
        </Button>
        <p className="flex items-start gap-2 rounded-xl bg-muted p-3 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          Only student accounts can apply for tuitions. You are signed in as a{" "}
          {role}.
        </p>
      </div>
    );
  } else if (checking) {
    actionPart = <Skeleton className="h-12 w-full rounded-full" />;
  } else if (applied) {
    actionPart = (
      <div className="space-y-3">
        <Button size="lg" className="w-full rounded-full" disabled>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Already Applied
        </Button>
        <div className="flex items-center justify-between rounded-xl bg-muted p-3 text-sm">
          <span className="text-muted-foreground">Application status</span>
          <span
            className={
              "rounded-full px-3 py-1 text-xs font-semibold " + statusClass
            }
          >
            {statusLabel}
          </span>
        </div>
      </div>
    );
  } else {
    actionPart = (
      <Button
        size="lg"
        onClick={() => setOpen(true)}
        className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
      >
        <Send className="mr-2 h-4 w-4" />
        Apply Now
      </Button>
    );
  }

  return (
    <>
      <div className="rounded-3xl border bg-card p-6 shadow-lg shadow-primary/5">
        <p className="text-sm text-muted-foreground">Monthly fee</p>
        <p className="mt-1 font-heading text-4xl font-bold text-primary">
          {monthlyFee.toLocaleString("en-US")}
          <span className="ml-1 text-base font-medium text-muted-foreground">
            BDT
          </span>
        </p>

        <div className="mt-4 flex items-center gap-2 border-t pt-4 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4 text-primary" />
          {daysPerWeek} days / week
        </div>

        <div className="mt-6">{actionPart}</div>
      </div>

      {/* Apply form modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Apply for this tuition</DialogTitle>
            <DialogDescription>{tuitionTitle}</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="apply-phone">Phone number</Label>
              <Input
                id="apply-phone"
                placeholder="01712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="apply-schedule">Preferred schedule</Label>
              <Input
                id="apply-schedule"
                placeholder="Example: Sat, Mon, Wed at 6 PM"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
              />
              {errors.schedule && (
                <p className="text-sm text-destructive">{errors.schedule}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="apply-note">Learning note</Label>
              <Textarea
                id="apply-note"
                rows={4}
                placeholder="Tell the tutor about your goals and what you need help with"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              {errors.note && (
                <p className="text-sm text-destructive">{errors.note}</p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full"
              disabled={submitting}
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitting ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
