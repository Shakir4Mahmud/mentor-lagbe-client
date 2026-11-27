"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";
import { Search, Sparkles, ShieldCheck, Laptop, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroCarousel from "@/components/home/HeroCarousel";
import { heroCards } from "@/lib/heroCards";

const headlineWords = [
  { text: "Find", gold: false },
  { text: "Your", gold: false },
  { text: "Ideal", gold: false },
  { text: "Tutor", gold: true },
  { text: "or", gold: false },
  { text: "Mentorship", gold: false },
  { text: "Batch", gold: false },
  { text: "Today", gold: false },
];

const popularSubjects = [
  { label: "Bangla", value: "Bangla" },
  { label: "English", value: "English" },
  { label: "ICT", value: "ICT" },
  { label: "Physics", value: "Physics" },
];

const trustPoints = [
  { label: "Verified Tutors", icon: ShieldCheck },
  { label: "Online and Offline", icon: Laptop },
  { label: "Secure Payments", icon: Lock },
];

export default function Hero() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const text = searchText.trim();

    if (text === "") {
      router.push("/tuitions");
      return;
    }

    router.push("/tuitions?search=" + encodeURIComponent(text));
  }

  return (
    <section className="relative -mt-[76px] overflow-hidden bg-hero-gradient pt-[76px] text-white">
      {/* Background decoration */}
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:28px_28px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-28 pt-14 sm:px-6 lg:grid-cols-2 lg:pt-20">
        {/* Left side: text and search */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm backdrop-blur"
          >
            <Sparkles className="h-4 w-4 text-accent" />
            Smart tuition and mentorship platform
          </motion.div>

          <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-5xl xl:text-6xl">
            {headlineWords.map((word, index) => {
              let wordClass = "mr-3 inline-block";
              if (word.gold) {
                wordClass = wordClass + " text-gold-gradient";
              }

              return (
                <motion.span
                  key={index}
                  className={wordClass}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
                >
                  {word.text}
                </motion.span>
              );
            })}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="mt-6 max-w-xl text-lg text-white/80"
          >
            Search verified tutors by subject, class level and budget. Apply in
            a minute and track your application in real time.
          </motion.p>

          {/* Search box */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.05 }}
            className="mt-8 flex max-w-xl items-center gap-2 rounded-full bg-white p-2 shadow-2xl shadow-black/20"
          >
            <Search className="ml-3 h-5 w-5 shrink-0 text-slate-500" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by subject or tuition title"
              className="h-11 min-w-0 flex-1 bg-transparent px-2 text-sm text-slate-900 outline-none placeholder:text-slate-500"
            />
            <Button
              type="submit"
              className="h-11 rounded-full bg-accent px-6 text-accent-foreground hover:bg-accent/90"
            >
              Find Tutors
            </Button>
          </motion.form>

          {/* Popular subjects */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="mt-5 flex flex-wrap items-center gap-2"
          >
            <span className="text-sm text-white/70">Popular:</span>
            {popularSubjects.map((subject) => (
              <Link
                key={subject.value}
                href={"/tuitions?subject=" + subject.value}
                className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs transition hover:bg-white/20"
              >
                {subject.label}
              </Link>
            ))}
          </motion.div>

          {/* Trust points */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.35 }}
            className="mt-10 flex flex-wrap gap-x-8 gap-y-3"
          >
            {trustPoints.map((point) => {
              const Icon = point.icon;
              return (
                <div
                  key={point.label}
                  className="flex items-center gap-2 text-sm text-white/80"
                >
                  <Icon className="h-4 w-4 text-accent" />
                  {point.label}
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Right side: auto rotating card carousel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <HeroCarousel cards={heroCards} />
        </motion.div>
      </div>

      {/* Curved wave at the bottom */}
      <svg
        viewBox="0 0 1440 80"
        className="absolute bottom-0 left-0 w-full text-background"
        fill="currentColor"
        preserveAspectRatio="none"
      >
        <path d="M0,40 C240,90 480,0 720,30 C960,60 1200,90 1440,40 L1440,80 L0,80 Z" />
      </svg>
    </section>
  );
}