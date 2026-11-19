"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  UserPlus,
  Search,
  Send,
  GraduationCap,
  FilePlus,
  ShieldCheck,
  Users,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";

type Step = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const studentSteps: Step[] = [
  {
    title: "Create your account",
    description:
      "Sign up as a student in under a minute with your name, email and password.",
    icon: UserPlus,
  },
  {
    title: "Search and filter",
    description:
      "Find the right tuition by subject, class level and mode, online or offline.",
    icon: Search,
  },
  {
    title: "Apply in one click",
    description:
      "Send your phone number, preferred schedule and a short note to the tutor.",
    icon: Send,
  },
  {
    title: "Track and learn",
    description:
      "See your application status in real time and start learning once accepted.",
    icon: GraduationCap,
  },
];

const tutorSteps: Step[] = [
  {
    title: "Join as a tutor",
    description:
      "Create a tutor account and complete your profile with a photo and short bio.",
    icon: UserPlus,
  },
  {
    title: "Post your tuition",
    description:
      "Add your subject, class level, fee, schedule and a banner image for your batch.",
    icon: FilePlus,
  },
  {
    title: "Get approved",
    description:
      "Our admin reviews your post, and approved tuitions go live for every student.",
    icon: ShieldCheck,
  },
  {
    title: "Manage applicants",
    description:
      "Review student applications and accept or reject them from your dashboard.",
    icon: Users,
  },
];

// Desktop er baka line (4 ta node er upor diye jay)
const wavePath =
  "M 0,100 C 75,100 75,40 150,40 C 300,40 300,160 450,160 C 600,160 600,40 750,40 C 900,40 900,160 1050,160 C 1125,160 1125,100 1200,100";

// Mobile er chhoto baka line (ek node theke arek node)
const mobileCurve = "M 28,0 C 58,30 -2,70 28,100";

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState("student");

  let steps = studentSteps;
  if (activeTab === "tutor") {
    steps = tutorSteps;
  }

  function tabClass(tabName: string) {
    let base =
      "relative rounded-full px-6 py-2.5 text-sm font-semibold transition-colors ";
    if (activeTab === tabName) {
      base = base + "text-primary-foreground";
    } else {
      base = base + "text-muted-foreground hover:text-foreground";
    }
    return base;
  }

  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-24 overflow-hidden bg-muted/50 py-20"
    >
      {/* Background decoration */}
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="How It Works"
          title="Simple steps, whether you learn or teach"
          subtitle="MentorLagbe connects students and tutors in a few easy steps."
        />

        {/* Tabs */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex rounded-full border bg-card p-1.5 shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab("student")}
              className={tabClass("student")}
            >
              {activeTab === "student" && (
                <motion.span
                  layoutId="how-tab"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10">For Students</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("tutor")}
              className={tabClass("tutor")}
            >
              {activeTab === "tutor" && (
                <motion.span
                  layoutId="how-tab"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10">For Tutors</span>
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
          >
            {/* ========== DESKTOP: baka line + zigzag ========== */}
            <div className="relative mt-16 hidden h-[420px] lg:block">
              <svg
                viewBox="0 0 1200 200"
                preserveAspectRatio="none"
                className="absolute left-0 top-0 z-0 h-[200px] w-full"
              >
                <defs>
                  <linearGradient
                    id="howGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" style={{ stopColor: "var(--primary)" }} />
                    <stop offset="100%" style={{ stopColor: "var(--accent)" }} />
                  </linearGradient>
                </defs>

                {/* Halka dashed line */}
                <path
                  d={wavePath}
                  fill="none"
                  strokeWidth="2"
                  strokeDasharray="8 8"
                  className="stroke-muted-foreground/40"
                  vectorEffect="non-scaling-stroke"
                />

                {/* Ankhe jaoya gradient line */}
                <motion.path
                  d={wavePath}
                  fill="none"
                  stroke="url(#howGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </svg>

              {steps.map((step, index) => {
                const Icon = step.icon;
                const leftPosition = index * 25 + "%";
                let topPosition = 0;
                if (index % 2 === 1) {
                  topPosition = 120;
                }
                const number = "0" + (index + 1);

                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.25 }}
                    className="group absolute z-10 w-1/4 px-3"
                    style={{ left: leftPosition, top: topPosition }}
                  >
                    {/* Node */}
                    <div className="relative mx-auto h-20 w-20">
                      <span className="absolute inset-0 animate-ping rounded-full bg-primary/20 [animation-duration:2.8s]" />
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary bg-card text-primary shadow-xl shadow-primary/20 transition duration-300 group-hover:-translate-y-1.5 group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-8 w-8" />
                      </div>
                      <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground shadow">
                        {index + 1}
                      </span>
                    </div>

                    {/* Card */}
                    <div className="relative mt-6 overflow-hidden rounded-2xl border bg-card/80 p-5 text-center shadow-sm backdrop-blur transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                      <span className="absolute right-3 top-1 font-heading text-5xl font-bold text-primary/10">
                        {number}
                      </span>
                      <h3 className="relative text-lg font-semibold">
                        {step.title}
                      </h3>
                      <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* ========== MOBILE ar TABLET: baka timeline ========== */}
            <div className="mx-auto mt-12 max-w-xl lg:hidden">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isLast = index === steps.length - 1;
                const number = "0" + (index + 1);

                let rowBottomSpace = "flex-1 pb-8";
                if (isLast) {
                  rowBottomSpace = "flex-1";
                }

                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5 }}
                    className="flex gap-4"
                  >
                    {/* Left: node ar baka line */}
                    <div className="flex w-14 shrink-0 flex-col items-center">
                      <div className="relative h-14 w-14">
                        <span className="absolute inset-0 animate-ping rounded-full bg-primary/20 [animation-duration:2.8s]" />
                        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground shadow">
                          {index + 1}
                        </span>
                      </div>

                      {!isLast && (
                        <svg
                          viewBox="0 0 56 100"
                          preserveAspectRatio="none"
                          className="min-h-[70px] w-14 flex-1"
                        >
                          <path
                            d={mobileCurve}
                            fill="none"
                            strokeWidth="2"
                            strokeDasharray="6 6"
                            className="stroke-muted-foreground/40"
                            vectorEffect="non-scaling-stroke"
                          />
                          <motion.path
                            d={mobileCurve}
                            fill="none"
                            strokeWidth="3"
                            strokeLinecap="round"
                            className="stroke-primary"
                            vectorEffect="non-scaling-stroke"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, delay: 0.3 }}
                          />
                        </svg>
                      )}
                    </div>

                    {/* Right: card */}
                    <div className={rowBottomSpace}>
                      <div className="relative overflow-hidden rounded-2xl border bg-card/80 p-5 shadow-sm backdrop-blur">
                        <span className="absolute right-3 top-0 font-heading text-5xl font-bold text-primary/10">
                          {number}
                        </span>
                        <h3 className="relative text-lg font-semibold">
                          {step.title}
                        </h3>
                        <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <div className="mt-14 text-center">
          {activeTab === "student" ? (
            <Button asChild size="lg" className="rounded-full">
              <Link href="/tuitions">
                Browse Tuitions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              size="lg"
              className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link href="/sign-up?role=tutor">
                Become a Tutor
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}