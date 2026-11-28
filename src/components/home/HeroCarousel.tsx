"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from "react";
import { motion } from "motion/react";
import { CheckCircle2, ChevronLeft, ChevronRight, Video } from "lucide-react";
import type { HeroCard } from "@/lib/heroCards";
import { useIsMobile } from "@/lib/useIsMobile";

type HeroCarouselProps = {
  cards: HeroCard[];
};

function getInitials(name: string) {
  const parts = name.split(" ");
  let initials = parts[0].charAt(0);
  if (parts.length > 1) {
    initials = initials + parts[1].charAt(0);
  }
  return initials.toUpperCase();
}

// Unsplash URLs already carry w=600. Serve smaller files on phones without
// touching the editable image URLs in heroCards.ts. Custom/local images are
// left alone.
function heroImageSrcSet(url: string) {
  if (!url.startsWith("https://images.unsplash.com/") || !url.includes("w=")) {
    return undefined;
  }

  const small = url.replace(/([?&])w=\d+/, "$1w=320");
  const medium = url.replace(/([?&])w=\d+/, "$1w=480");

  return small + " 320w, " + medium + " 480w, " + url + " 600w";
}

export default function HeroCarousel({ cards }: HeroCarouselProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const isMobile = useIsMobile();

  // Pointer drag/swipe: same handler covers touch screens and mouse laptops.
  const dragStartX = useRef<number | null>(null);
  const didDrag = useRef(false);

  const total = cards.length;
  const half = Math.floor(total / 2);
  const spread = isMobile ? 70 : 105;

  // Auto change: 3.5 second pore porer card
  useEffect(() => {
    if (paused || total < 2) {
      return;
    }

    const timer = setInterval(() => {
      setActive((current) => (current + 1) % total);
    }, 3500);

    return () => {
      clearInterval(timer);
    };
  }, [paused, total]);

  // Shared by drag, dots and the laptop arrow buttons.
  function changeCard(direction: -1 | 1) {
    setActive((current) => {
      if (direction === 1) {
        return (current + 1) % total;
      }
      return (current - 1 + total) % total;
    });
  }

  // A short left/right drag moves to the next/previous card. The existing
  // animation stays exactly the same — only the active index changes.
  function finishDrag(endX: number) {
    const startX = dragStartX.current;
    dragStartX.current = null;

    if (startX === null) {
      return;
    }

    const delta = endX - startX;
    if (Math.abs(delta) < 45) {
      return;
    }

    didDrag.current = true;
    changeCard(delta < 0 ? 1 : -1);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    dragStartX.current = event.clientX;
    didDrag.current = false;
    setPaused(true);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragStartX.current === null) {
      return;
    }

    if (Math.abs(event.clientX - dragStartX.current) > 8) {
      didDrag.current = true;
    }
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    finishDrag(event.clientX);

    // Mouse pause is handled by hover; touch needs the timer restarted here.
    if (event.pointerType !== "mouse") {
      setPaused(false);
    }
  }

  function handlePointerCancel() {
    dragStartX.current = null;
    setPaused(false);
  }

  function handlePointerLeave(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragStartX.current === null) {
      return;
    }

    finishDrag(event.clientX);
  }

  // Arrows sit inside the drag area; keep their clicks separate from swipes.
  function stopDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    event.stopPropagation();
    dragStartX.current = null;
    didDrag.current = false;
  }

  // A drag ends with a synthetic click on the card Link. Swallow only that
  // click so swiping never opens a tuition page by accident.
  function handleClickCapture(event: ReactMouseEvent<HTMLDivElement>) {
    if (!didDrag.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    didDrag.current = false;
  }

  if (total === 0) {
    return null;
  }

  return (
    <div
      className="relative mx-auto w-full max-w-[600px] cursor-grab active:cursor-grabbing"
      style={{ touchAction: "pan-y" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerLeave}
      onClickCapture={handleClickCapture}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Glow behind cards — smaller blur radius on phones */}
      <div className="absolute left-1/2 top-[45%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/25 blur-xl sm:blur-3xl" />

      {/* Laptop/mouse arrows — hidden on phones and tablets where swipe is used */}
      <button
        type="button"
        onClick={() => changeCard(-1)}
        onPointerDown={stopDrag}
        aria-label="Previous card"
        className="absolute left-0 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white shadow-lg backdrop-blur transition hover:bg-white/20 lg:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={() => changeCard(1)}
        onPointerDown={stopDrag}
        aria-label="Next card"
        className="absolute right-0 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white shadow-lg backdrop-blur transition hover:bg-white/20 lg:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Whole stack floats up and down — paused on phones to save frames */}
      <motion.div
        animate={isMobile ? { y: 0 } : { y: [0, -10, 0] }}
        transition={
          isMobile
            ? { duration: 0 }
            : { duration: 5, repeat: Infinity, ease: "easeInOut" }
        }
        className="relative h-[400px] sm:h-[420px]"
        style={{ perspective: 1000 }}
      >
        {cards.map((card, index) => {
          // active card theke koto dure ache (-2, -1, 0, 1, 2)
          const offset = ((index - active + total + half) % total) - half;
          const distance = Math.abs(offset);

          let zIndex = 10 - distance;
          if (zIndex < 0) {
            zIndex = 0;
          }

          let cardOpacity = 1 - distance * 0.3;
          if (distance > 2) {
            cardOpacity = 0;
          }

          let blurAmount = 0;
          if (distance === 1) {
            blurAmount = 1.5;
          }
          if (distance >= 2) {
            blurAmount = 3;
          }

          let pointerEvents: "auto" | "none" = "auto";
          if (distance > 2) {
            pointerEvents = "none";
          }

          return (
            <motion.div
              key={card.id}
              initial={false}
              animate={{
                x: offset * spread,
                scale: 1 - distance * 0.16,
                rotateY: offset * -22,
                opacity: cardOpacity,
                filter: "blur(" + blurAmount + "px)",
              }}
              transition={{
                duration: isMobile ? 0.35 : 0.6,
                ease: "easeInOut",
                // Animated blur repaints every frame; snap it on phones.
                filter: { duration: isMobile ? 0 : 0.6 },
              }}
              className="absolute left-1/2 top-1/2 cursor-pointer overflow-hidden rounded-3xl shadow-2xl shadow-black/30"
              style={{
                width: 240,
                height: 320,
                marginLeft: -120,
                marginTop: -160,
                backgroundColor: card.color,
                zIndex: zIndex,
                pointerEvents: pointerEvents,
              }}
            >
              {/* Subject text */}
              <div className="absolute left-0 top-0 z-10 p-5">
                <h3 className="font-heading text-2xl font-semibold text-[#0b2e2b]">
                  {card.subject}
                </h3>
                <p className="mt-0.5 text-sm text-[#0b2e2b]/70">
                  {card.subtitle}
                </p>
              </div>

              {/* Image area */}
              <div className="absolute bottom-0 h-[66%] w-full">
                {/* Fallback initials (image na ashle eta dekha jabe) */}
                <div className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-[#0b2e2b]/20">
                  {getInitials(card.subject)}
                </div>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.image}
                  srcSet={heroImageSrcSet(card.image)}
                  sizes="240px"
                  alt={card.subject}
                  loading={distance === 0 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={distance === 0 ? "high" : "low"}
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />

                {/* Soft fade from card color into photo */}
                <div
                  className="absolute left-0 top-0 h-12 w-full"
                  style={{
                    background:
                      "linear-gradient(to bottom, " +
                      card.color +
                      ", transparent)",
                  }}
                />
              </div>

              {/* Pura card clickable — oi category-r tuitions-e jabe */}
              <Link
                href={"/tuitions?subject=" + encodeURIComponent(card.subject)}
                onClick={() => setActive(index)}
                aria-label={"Browse " + card.subject + " tuitions"}
                className="absolute inset-0 z-20"
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Floating badge 1 */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-0 top-2 z-20 hidden items-center gap-3 rounded-2xl bg-white px-4 py-3 text-[#10231f] shadow-xl shadow-black/20 sm:flex"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        </span>
        <div>
          <p className="text-sm font-semibold">Application accepted</p>
          <p className="text-xs text-slate-500">Just now</p>
        </div>
      </motion.div>

      {/* Floating badge 2 */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-0 z-20 hidden items-center gap-3 rounded-2xl bg-[#d4a24c] px-4 py-3 text-[#1a1405] shadow-xl shadow-black/20 sm:flex"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/60">
          <Video className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold">Live class in 10 min</p>
          <p className="text-xs opacity-80">Physics, Zoom</p>
        </div>
      </motion.div>

      {/* Dots */}
      <div className="mt-2 flex items-center justify-center gap-2">
        {cards.map((card, index) => {
          let dotClass = "h-2 rounded-full transition-all duration-300 ";
          if (index === active) {
            dotClass = dotClass + "w-6 bg-accent";
          } else {
            dotClass = dotClass + "w-2 bg-white/40 hover:bg-white/70";
          }

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => setActive(index)}
              aria-label={"Show " + card.subject}
              className={dotClass}
            />
          );
        })}
      </div>
    </div>
  );
}