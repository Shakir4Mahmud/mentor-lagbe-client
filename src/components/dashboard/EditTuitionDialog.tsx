"use client";

import { useState } from "react";
import {
  BookOpen,
  GraduationCap,
  Laptop,
  Building2,
  Loader2,
  Save,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { subjectOptions, classLevelOptions } from "@/lib/constants";
import type { MyTuition, Tuition } from "@/types";
import ImageUploader from "@/components/shared/ImageUploader";
import FilterSelect from "@/components/tuitions/FilterSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type EditTuitionDialogProps = {
  tuition: MyTuition;
  onClose: () => void;
  onSaved: (updated: Tuition) => void;
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

export default function EditTuitionDialog({
  tuition,
  onClose,
  onSaved,
}: EditTuitionDialogProps) {
  const [title, setTitle] = useState(tuition.title);
  const [subject, setSubject] = useState(tuition.subject);
  const [classLevel, setClassLevel] = useState(tuition.classLevel);
  const [mode, setMode] = useState(tuition.mode);
  const [location, setLocation] = useState(tuition.location);
  const [monthlyFee, setMonthlyFee] = useState(String(tuition.monthlyFee));
  const [daysPerWeek, setDaysPerWeek] = useState(tuition.daysPerWeek);
  const [description, setDescription] = useState(tuition.description);
  const [bannerImage, setBannerImage] = useState(tuition.bannerImage);

  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setSaving(true);

    try {
      const data = await apiFetch<{ message: string; tuition: Tuition }>(
        "/api/tuitions/" + tuition._id,
        {
          method: "PATCH",
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
        }
      );

      toast.success(data.message);
      onSaved(data.tuition);
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    }

    setSaving(false);
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

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open && !saving) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit tuition</DialogTitle>
          <DialogDescription>
            Update your tuition details below.
          </DialogDescription>
        </DialogHeader>

        <p className="flex items-start gap-2 rounded-xl bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          After saving, your tuition will be sent for admin review again.
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Tuition title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

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

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location or platform</Label>
              <Input
                id="edit-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              {errors.location && (
                <p className="text-sm text-destructive">{errors.location}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-fee">Monthly fee (BDT)</Label>
              <Input
                id="edit-fee"
                inputMode="numeric"
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

          <div className="space-y-2">
            <Label>Days per week</Label>
            <div className="flex flex-wrap gap-2">
              {dayOptions.map((day) => {
                let dayClass =
                  "flex h-11 w-11 items-center justify-center rounded-xl border-2 text-sm font-semibold transition ";
                if (daysPerWeek === day) {
                  dayClass =
                    dayClass +
                    "border-primary bg-primary text-primary-foreground";
                } else {
                  dayClass = dayClass + "border-border hover:border-primary/40";
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-description">Description</Label>
              <span className="text-xs text-muted-foreground">
                {description.length}/1000
              </span>
            </div>
            <Textarea
              id="edit-description"
              rows={5}
              maxLength={1000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

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
                <Save className="mr-2 h-4 w-4" />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}