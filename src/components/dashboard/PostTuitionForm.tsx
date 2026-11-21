"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BookOpen,
  GraduationCap,
  Laptop,
  Building2,
  Loader2,
  Send,
  Crown,
  Lightbulb,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import {
  subjectOptions,
  classLevelOptions,
} from "@/lib/constants";
import ImageUploader from "@/components/shared/ImageUploader";
import FilterSelect from "@/components/tuitions/FilterSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

type Usage = {
  posted: number;
  limit: number | null;
  plan: string;
};

type FormErrors = {
  title?: string;
  subject?: string;
  classLevel?: string;
  location?: string;
  monthlyFee?: string;
  description?: string;
  bannerImage?: string;
};

const dayOptions = [1, 2, 3, 4, 5, 6, 7];

const tips = [
  "Write a clear title with the subject and class level.",
  "Upload a bright, good quality banner image.",
  "Explain what students will learn in the description.",
  "Admin reviews every post before it goes live.",
];

export default function PostTuitionForm() {
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loadingUsage, setLoadingUsage] = useState(true);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [mode, setMode] = useState("Online");
  const [location, setLocation] = useState("");
  const [monthlyFee, setMonthlyFee] = useState("");
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [description, setDescription] = useState("");
  const [bannerImage, setBannerImage] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadUsage() {
      try {
        const data = await apiFetch<Usage>("/api/tuitions/my/usage");
        setUsage(data);
      } catch {
        toast.error("Could not load your plan usage");
      }
      setLoadingUsage(false);
    }

    loadUsage();
  }, []);

  // Free plan limit shesh kina
  let limitReached = false;
  if (usage && usage.limit !== null && usage.posted >= usage.limit) {
    limitReached = true;
  }

  function validateForm() {
    const newErrors: FormErrors = {};

    if (title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    } else if (title.trim().length > 100) {
      newErrors.title = "Title must be 100 characters or less";
    }

    if (subject === "") {
      newErrors.subject = "Please select a subject";
    }

    if (classLevel === "") {
      newErrors.classLevel = "Please select a class level";
    }

    if (location.trim() === "") {
      newErrors.location = "Location or platform is required";
    }

    const fee = Number(monthlyFee);
    if (monthlyFee.trim() === "" || isNaN(fee)) {
      newErrors.monthlyFee = "Enter a valid monthly fee";
    } else if (fee < 100 || fee > 100000) {
      newErrors.monthlyFee = "Fee must be between 100 and 100,000 BDT";
    }

    if (description.trim().length < 30) {
      newErrors.description = "Description must be at least 30 characters";
    }

    if (bannerImage === "") {
      newErrors.bannerImage = "Please upload a banner image";
    }

    setErrors(newErrors);

    const errorCount = Object.keys(newErrors).length;
    if (errorCount === 0) {
      return true;
    }
    return false;
  }

  function resetForm() {
    setTitle("");
    setSubject("");
    setClassLevel("");
    setMode("Online");
    setLocation("");
    setMonthlyFee("");
    setDaysPerWeek(3);
    setDescription("");
    setBannerImage("");
    setErrors({});
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setSubmitting(true);

    try {
      await apiFetch("/api/tuitions", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          subject: subject,
          classLevel: classLevel,
          mode: mode,
          location: location.trim(),
          monthlyFee: Number(monthlyFee),
          daysPerWeek: daysPerWeek,
          description: description.trim(),
          bannerImage: bannerImage,
        }),
      });

      toast.success("Tuition submitted! It will go live after admin approval.");
      resetForm();

      if (usage) {
        setUsage({
          posted: usage.posted + 1,
          limit: usage.limit,
          plan: usage.plan,
        });
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    }

    setSubmitting(false);
  }

  // Mode card er class
  let onlineClass =
    "flex items-center justify-center gap-2 rounded-xl border-2 p-3 text-sm font-medium transition ";
  let offlineClass = onlineClass;

  if (mode === "Online") {
    onlineClass = onlineClass + "border-primary bg-secondary text-primary";
    offlineClass =
      offlineClass + "border-border text-muted-foreground hover:border-primary/40";
  } else {
    offlineClass = offlineClass + "border-primary bg-secondary text-primary";
    onlineClass =
      onlineClass + "border-border text-muted-foreground hover:border-primary/40";
  }

  let locationPlaceholder = "Example: Dhanmondi, Dhaka";
  if (mode === "Online") {
    locationPlaceholder = "Example: Online (Zoom)";
  }

  // Usage card er progress
  let percent = 0;
  if (usage && usage.limit !== null) {
    percent = Math.min(100, (usage.posted / usage.limit) * 100);
  }

  let barClass = "h-full rounded-full transition-all duration-500 ";
  if (limitReached) {
    barClass = barClass + "bg-rose-500";
  } else {
    barClass = barClass + "bg-primary";
  }

  let leftSide = null;

  if (loadingUsage) {
    leftSide = <Skeleton className="h-[640px] w-full rounded-3xl" />;
  } else if (limitReached && usage) {
    leftSide = (
      <div className="flex flex-col items-center rounded-3xl border bg-card px-6 py-16 text-center shadow-sm">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-accent-foreground dark:text-accent">
          <Lock className="h-8 w-8" />
        </span>
        <h2 className="mt-5 text-2xl font-semibold">Free plan limit reached</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          You have posted {usage.posted} of {usage.limit} tuitions allowed on
          the Free plan. Upgrade to Pro to post unlimited tuitions and get a
          verified badge.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-6 rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Link href="/pricing">
            <Crown className="mr-2 h-4 w-4" />
            Upgrade to Pro
          </Link>
        </Button>
      </div>
    );
  } else {
    leftSide = (
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-6 rounded-3xl border bg-card p-6 shadow-sm sm:p-8"
      >
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="tuition-title">Tuition title</Label>
          <Input
            id="tuition-title"
            placeholder="Example: Complete SSC Mathematics Mastery"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title}</p>
          )}
        </div>

        {/* Subject + Class level */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Subject</Label>
            <FilterSelect
              value={subject}
              onChange={setSubject}
              allLabel="Select subject"
              options={subjectOptions}
              icon={BookOpen}
            />
            {errors.subject && (
              <p className="text-sm text-destructive">{errors.subject}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Class level</Label>
            <FilterSelect
              value={classLevel}
              onChange={setClassLevel}
              allLabel="Select class level"
              options={classLevelOptions}
              icon={GraduationCap}
            />
            {errors.classLevel && (
              <p className="text-sm text-destructive">{errors.classLevel}</p>
            )}
          </div>
        </div>

        {/* Mode */}
        <div className="space-y-2">
          <Label>Mode</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode("Online")}
              className={onlineClass}
            >
              <Laptop className="h-4 w-4" />
              Online
            </button>
            <button
              type="button"
              onClick={() => setMode("Offline")}
              className={offlineClass}
            >
              <Building2 className="h-4 w-4" />
              Offline
            </button>
          </div>
        </div>

        {/* Location + Fee */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="tuition-location">Location or platform</Label>
            <Input
              id="tuition-location"
              placeholder={locationPlaceholder}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            {errors.location && (
              <p className="text-sm text-destructive">{errors.location}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tuition-fee">Monthly fee (BDT)</Label>
            <Input
              id="tuition-fee"
              inputMode="numeric"
              placeholder="Example: 3500"
              value={monthlyFee}
              onChange={(e) =>
                setMonthlyFee(e.target.value.replace(/\D/g, ""))
              }
            />
            {errors.monthlyFee && (
              <p className="text-sm text-destructive">{errors.monthlyFee}</p>
            )}
          </div>
        </div>

        {/* Days per week */}
        <div className="space-y-2">
          <Label>Days per week</Label>
          <div className="flex flex-wrap gap-2">
            {dayOptions.map((day) => {
              let dayClass =
                "flex h-11 w-11 items-center justify-center rounded-xl border-2 text-sm font-semibold transition ";
              if (daysPerWeek === day) {
                dayClass =
                  dayClass + "border-primary bg-primary text-primary-foreground";
              } else {
                dayClass =
                  dayClass + "border-border hover:border-primary/40";
              }

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setDaysPerWeek(day)}
                  className={dayClass}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="tuition-description">Description</Label>
            <span className="text-xs text-muted-foreground">
              {description.length}/1000
            </span>
          </div>
          <Textarea
            id="tuition-description"
            rows={6}
            maxLength={1000}
            placeholder="Describe what students will learn, your teaching method and class routine"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description}</p>
          )}
        </div>

        {/* Banner */}
        <div className="space-y-2">
          <Label>Banner image</Label>
          <ImageUploader
            value={bannerImage}
            onChange={setBannerImage}
            shape="banner"
          />
          {errors.bannerImage && (
            <p className="text-sm text-destructive">{errors.bannerImage}</p>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="w-full rounded-full"
        >
          {submitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          {submitting ? "Submitting..." : "Submit for Approval"}
        </Button>
      </form>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
     <div className="min-w-0 lg:col-span-2">{leftSide}</div>

      {/* Right: usage and tips */}
      <aside className="space-y-6 lg:col-span-1">
        <div className="lg:sticky lg:top-24 lg:space-y-6">
          {/* Usage card */}
          <div className="rounded-3xl border bg-card p-6 shadow-sm">
            <h3 className="font-semibold">Your plan usage</h3>

            {loadingUsage || !usage ? (
              <Skeleton className="mt-4 h-16 w-full" />
            ) : usage.limit === null ? (
              <div className="mt-4">
                <p className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Crown className="h-4 w-4" />
                  Pro plan: unlimited posts
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  You have posted {usage.posted}{" "}
                  {usage.posted === 1 ? "tuition" : "tuitions"} so far.
                </p>
              </div>
            ) : (
              <div className="mt-4">
                <div className="flex items-end justify-between">
                  <p className="font-heading text-3xl font-bold">
                    {usage.posted}
                    <span className="text-lg font-medium text-muted-foreground">
                      {" "}
                      / {usage.limit}
                    </span>
                  </p>
                  <span className="text-xs text-muted-foreground">
                    Free plan posts
                  </span>
                </div>

                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className={barClass} style={{ width: percent + "%" }} />
                </div>

                {limitReached ? (
                  <p className="mt-3 text-sm text-rose-600 dark:text-rose-400">
                    Limit reached. Upgrade to post more.
                  </p>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">
                    {usage.limit - usage.posted} post
                    {usage.limit - usage.posted === 1 ? "" : "s"} left on the
                    Free plan.
                  </p>
                )}

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full rounded-full"
                >
                  <Link href="/pricing">
                    <Crown className="mr-2 h-4 w-4 text-accent" />
                    Go Pro for unlimited
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Tips card */}
          <div className="mt-6 rounded-3xl border bg-card p-6 shadow-sm lg:mt-0">
            <h3 className="flex items-center gap-2 font-semibold">
              <Lightbulb className="h-4 w-4 text-accent" />
              Tips for a great post
            </h3>
            <ul className="mt-4 space-y-3">
              {tips.map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}