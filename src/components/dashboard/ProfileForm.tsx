"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Crown, Loader2, Mail, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import ImageUploader from "@/components/shared/ImageUploader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ProfileUser = {
  name: string;
  email: string;
  image: string;
  phone: string;
  bio: string;
  role: string;
  plan: string;
};

type ProfileFormProps = {
  user: ProfileUser;
};

type FormErrors = {
  name?: string;
  phone?: string;
};

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();

  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [bio, setBio] = useState(user.bio);
  const [image, setImage] = useState(user.image);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  const isPro = user.plan === "pro";
  const roleLabel = user.role.charAt(0).toUpperCase() + user.role.slice(1);

  let initial = "U";
  if (name.trim() !== "") {
    initial = name.trim().charAt(0).toUpperCase();
  }

  // Kichu bodleche kina
  const hasChanges =
    name.trim() !== user.name ||
    phone.trim() !== user.phone ||
    bio.trim() !== user.bio ||
    image !== user.image;

  function validateForm() {
    const newErrors: FormErrors = {};
    const cleanPhone = phone.replace(/[\s-]/g, "");
    const phonePattern = /^(\+?88)?01[3-9]\d{8}$/;

    if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // phone optional, kintu dile thik format e dite hobe
    if (cleanPhone !== "" && !phonePattern.test(cleanPhone)) {
      newErrors.phone = "Enter a valid phone number, for example 01712345678";
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

    setSaving(true);

    const result = await authClient.updateUser({
      name: name.trim(),
      image: image,
      phone: phone.replace(/[\s-]/g, ""),
      bio: bio.trim(),
    });

    if (result.error) {
      let message = "Could not update profile. Please try again.";
      if (result.error.message) {
        message = result.error.message;
      }
      toast.error(message);
      setSaving(false);
      return;
    }

    toast.success("Profile updated successfully!");
    setSaving(false);

    // sidebar er server data notun kore ana
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left: profile card */}
      <div className="space-y-6 lg:col-span-1">
        <div className="rounded-3xl border bg-card p-6 text-center shadow-sm">
          <ImageUploader
            value={image}
            onChange={setImage}
            shape="avatar"
            fallbackText={initial}
          />

          <h2 className="mt-5 font-heading text-xl font-semibold">
            {name.trim() !== "" ? name : "Your name"}
          </h2>

          <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />
            {user.email}
          </p>

          <div className="mt-4 flex items-center justify-center gap-2">
            <Badge variant="secondary">{roleLabel}</Badge>
            <Badge
              variant={isPro ? "default" : "outline"}
              className={isPro ? "bg-accent text-accent-foreground" : ""}
            >
              {isPro ? "Pro" : "Free"}
            </Badge>
          </div>
        </div>

        {/* Plan card */}
        {isPro ? (
          <div className="relative overflow-hidden rounded-3xl bg-hero-gradient p-6 text-white">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/25 blur-2xl" />
            <Crown className="relative h-7 w-7 text-accent" />
            <h3 className="relative mt-3 text-lg font-semibold">
              Pro plan active
            </h3>
            <p className="relative mt-1 text-sm text-white/75">
              You are enjoying all the Pro benefits on MentorLagbe.
            </p>
          </div>
        ) : (
          user.role !== "admin" && (
            <div className="rounded-3xl border bg-card p-6">
              <Sparkles className="h-7 w-7 text-accent" />
              <h3 className="mt-3 text-lg font-semibold">You are on Free</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Upgrade to Pro for more benefits and a Pro badge on your
                profile.
              </p>
              <Button
                asChild
                className="mt-4 w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Link href="/pricing">Upgrade to Pro</Link>
              </Button>
            </div>
          )
        )}
      </div>

      {/* Right: form */}
      <div className="lg:col-span-2">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8"
        >
          <h2 className="text-xl font-semibold">Personal information</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your name, contact number and a short bio.
          </p>

          <div className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Full name</Label>
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                value={user.email}
                disabled
                readOnly
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-phone">Phone number</Label>
              <Input
                id="profile-phone"
                placeholder="01712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="profile-bio">Bio</Label>
                <span className="text-xs text-muted-foreground">
                  {bio.length}/200
                </span>
              </div>
              <Textarea
                id="profile-bio"
                rows={5}
                maxLength={200}
                placeholder="Write a short bio about yourself"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3">
            {hasChanges && !saving && (
              <span className="text-sm text-muted-foreground">
                You have unsaved changes
              </span>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={saving || !hasChanges}
              className="rounded-full px-8"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}