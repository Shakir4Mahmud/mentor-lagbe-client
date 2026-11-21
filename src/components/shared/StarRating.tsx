"use client";

import { useState } from "react";
import { Star } from "lucide-react";

// ===== Star dekhanor jonno (partial star o hoy, jemon 4.3) =====

type StarDisplayProps = {
  value: number;
  size?: number;
};

export function StarDisplay({ value, size = 16 }: StarDisplayProps) {
  const stars = [0, 1, 2, 3, 4];

  return (
    <span
      className="inline-flex items-center gap-0.5"
      aria-label={"Rated " + value + " out of 5"}
    >
      {stars.map((index) => {
        // ei star koto % bhora hobe
        let fill = value - index;
        if (fill < 0) {
          fill = 0;
        }
        if (fill > 1) {
          fill = 1;
        }
        const percent = fill * 100;

        return (
          <span
            key={index}
            className="relative inline-block shrink-0"
            style={{ width: size, height: size }}
          >
            <Star
              className="absolute inset-0 text-muted-foreground/40"
              style={{ width: size, height: size }}
            />

            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: percent + "%" }}
            >
              <Star
                className="fill-accent text-accent"
                style={{
                  width: size,
                  height: size,
                  maxWidth: "none",
                  flexShrink: 0,
                }}
              />
            </span>
          </span>
        );
      })}
    </span>
  );
}

// ===== Star select korar jonno (review form e) =====

type StarInputProps = {
  value: number;
  onChange: (value: number) => void;
};

const starLabels = ["Poor", "Fair", "Good", "Very good", "Excellent"];

export function StarInput({ value, onChange }: StarInputProps) {
  const [hover, setHover] = useState(0);

  // Hover korle hover er star dekhabe, noile select kora ta
  let shown = value;
  if (hover > 0) {
    shown = hover;
  }

  const stars = [1, 2, 3, 4, 5];

  let label = "Tap a star to rate";
  if (shown > 0) {
    label = starLabels[shown - 1];
  }

  return (
    <div>
      <div
        className="flex items-center gap-1"
        onMouseLeave={() => setHover(0)}
      >
        {stars.map((star) => {
          let starClass = "h-9 w-9 transition-all duration-150 ";
          if (star <= shown) {
            starClass = starClass + "scale-110 fill-accent text-accent";
          } else {
            starClass = starClass + "text-muted-foreground/40";
          }

          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHover(star)}
              aria-label={star + " star"}
              className="rounded-md p-0.5 outline-none transition active:scale-90 focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Star className={starClass} />
            </button>
          );
        })}
      </div>

      <p className="mt-2 h-5 text-sm font-medium text-primary">{label}</p>
    </div>
  );
}