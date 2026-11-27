"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Video } from "lucide-react";
import type { HeroCard } from "@/lib/heroCards";

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

export default function HeroCarousel({ cards }: HeroCarouselProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [spread, setSpread] = useState(105);

  const total = cards.length;
  const half = Math.floor(total / 2);

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

  // Mobile e card gulo kache kache thakbe
  useEffect(() => {
    function updateSpread() {
      if (window.innerWidth < 640) {
        setSpread(70);
      } else {
        setSpread(105);
      }
    }

    updateSpread();
    window.addEventListener("resize", updateSpread);

    return () => {
      window.removeEventListener("resize", updateSpread);
    };
  }, []);

  if (total === 0) {
    return null;
  }

  return (
    <div
      className="relative mx-auto w-full max-w-[600px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Glow behind cards */}
      <div className="absolute left-1/2 top-[45%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/25 blur-3xl" />

      {/* Whole stack floats up and down */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
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
              transition={{ duration: 0.6, ease: "easeInOut" }}
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
                  alt={card.subject}
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