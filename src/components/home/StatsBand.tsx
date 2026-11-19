"use client";

import { motion } from "motion/react";
import { GraduationCap, Users, BookOpen, Layers } from "lucide-react";
import AnimatedCounter from "@/components/shared/AnimatedCounter";

type StatsBandProps = {
  tutors: number;
  students: number;
  tuitions: number;
  subjects: number;
};

export default function StatsBand({
  tutors,
  students,
  tuitions,
  subjects,
}: StatsBandProps) {
  const stats = [
    { label: "Verified Tutors", value: tutors, icon: GraduationCap },
    { label: "Happy Students", value: students, icon: Users },
    { label: "Live Tuitions", value: tuitions, icon: BookOpen },
    { label: "Subjects Covered", value: subjects, icon: Layers },
  ];

  return (
    <section className="relative overflow-hidden bg-hero-gradient py-16 text-white">
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute inset-0 opacity-15 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:28px_28px]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:px-6 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="rounded-2xl border border-white/15 bg-white/10 p-6 text-center backdrop-blur"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-accent">
                <Icon className="h-6 w-6" />
              </span>

              <p className="mt-4 font-heading text-4xl font-bold md:text-5xl">
                <AnimatedCounter value={stat.value} suffix="+" />
              </p>
              <p className="mt-1 text-sm text-white/75">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}