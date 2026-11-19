"use client";

import { useRef, useState } from "react";
import { Camera, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { uploadToImgbb } from "@/lib/imgbb";
import { Button } from "@/components/ui/button";

type ImageUploaderProps = {
  value: string;
  onChange: (url: string) => void;
  shape?: "avatar" | "banner";
  fallbackText?: string;
};

// Max 5 MB
const maxSize = 5 * 1024 * 1024;

export default function ImageUploader({
  value,
  onChange,
  shape = "avatar",
  fallbackText = "U",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  function openPicker() {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    let file: File | null = null;
    if (e.target.files && e.target.files.length > 0) {
      file = e.target.files[0];
    }

    // same file abar select kora jabe
    e.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > maxSize) {
      toast.error("Image must be smaller than 5 MB");
      return;
    }

    setUploading(true);

    try {
      const url = await uploadToImgbb(file);
      onChange(url);
      toast.success("Image uploaded");
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    }

    setUploading(false);
  }

  function handleRemove() {
    onChange("");
  }

  const hiddenInput = (
    <input
      ref={inputRef}
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="hidden"
    />
  );

  // ===== Avatar shape =====
  if (shape === "avatar") {
    return (
      <div className="flex flex-col items-center gap-4">
        {hiddenInput}

        <div className="relative">
          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-primary text-4xl font-bold text-primary-foreground shadow-lg ring-4 ring-primary/20">
            {value !== "" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt="Profile photo"
                className="h-full w-full object-cover"
              />
            ) : (
              fallbackText
            )}

            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={openPicker}
            disabled={uploading}
            aria-label="Change photo"
            className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-accent text-accent-foreground shadow transition hover:scale-110 disabled:opacity-60"
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={openPicker}
            disabled={uploading}
            className="rounded-full"
          >
            {uploading ? "Uploading..." : "Change photo"}
          </Button>

          {value !== "" && !uploading && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="rounded-full text-destructive hover:text-destructive"
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Remove
            </Button>
          )}
        </div>
      </div>
    );
  }

  // ===== Banner shape (Post Tuition e lagbe) =====
  return (
    <div>
      {hiddenInput}

      {value !== "" ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Banner"
            className="h-full w-full object-cover"
          />

          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}

          <div className="absolute bottom-3 right-3 flex gap-2">
            <Button
              type="button"
              size="sm"
              onClick={openPicker}
              disabled={uploading}
              className="rounded-full"
            >
              <Camera className="mr-1 h-4 w-4" />
              Change
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={handleRemove}
              disabled={uploading}
              className="rounded-full"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          disabled={uploading}
          className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed bg-muted/40 text-muted-foreground transition hover:border-primary hover:bg-secondary/50 hover:text-primary disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <ImagePlus className="h-8 w-8" />
          )}
          <span className="text-sm font-medium">
            {uploading ? "Uploading..." : "Click to upload a banner image"}
          </span>
          <span className="text-xs">PNG, JPG or WEBP, up to 5 MB</span>
        </button>
      )}
    </div>
  );
}