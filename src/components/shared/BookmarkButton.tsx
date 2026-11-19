"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { useSaved } from "@/components/providers/SavedProvider";

type BookmarkButtonProps = {
  tuitionId: string;
  variant?: "icon" | "full";
};

export default function BookmarkButton({
  tuitionId,
  variant = "icon",
}: BookmarkButtonProps) {
  const router = useRouter();
  const { savedIds, isLoggedIn, isStudent, toggleSaved } = useSaved();
  const [busy, setBusy] = useState(false);

  // Tutor ar Admin ke heart dekhabo na
  if (isLoggedIn && !isStudent) {
    return null;
  }

  const saved = savedIds.includes(tuitionId);

  async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    // Login na thakle sign in e pathao
    if (!isLoggedIn) {
      const currentPath = window.location.pathname;
      router.push("/sign-in?redirect=" + currentPath);
      return;
    }

    setBusy(true);
    await toggleSaved(tuitionId);
    setBusy(false);
  }

  let heartClass = "h-5 w-5 transition-colors ";
  if (saved) {
    heartClass = heartClass + "fill-rose-500 text-rose-500";
  } else if (variant === "icon") {
    heartClass = heartClass + "text-slate-700";
  } else {
    heartClass = heartClass + "text-muted-foreground";
  }

  const heart = (
    <motion.span
      key={saved ? "saved" : "not-saved"}
      initial={{ scale: 0.6 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 15 }}
      className="flex"
    >
      <Heart className={heartClass} />
    </motion.span>
  );

  if (variant === "full") {
    let fullClass =
      "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition hover:shadow-md disabled:opacity-60 ";
    if (saved) {
      fullClass = fullClass + "border-rose-500/40 bg-rose-500/10 text-rose-600";
    } else {
      fullClass = fullClass + "bg-card hover:border-primary/50";
    }

    let label = "Save";
    if (saved) {
      label = "Saved";
    }

    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        className={fullClass}
      >
        {heart}
        {label}
      </button>
    );
  }

  let ariaLabel = "Save tuition";
  if (saved) {
    ariaLabel = "Remove from saved tuitions";
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-label={ariaLabel}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur transition hover:scale-110 disabled:opacity-60"
    >
      {heart}
    </button>
  );
}