"use client";

import { motion } from "motion/react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
}: PageHeaderProps) {
  return (
    <section className="relative -mt-[76px] overflow-hidden bg-hero-gradient pt-[76px] text-white">
      <div className="absolute -right-24 -top-24 hidden h-72 w-72 rounded-full bg-accent/20 blur-3xl sm:block" />
      <div className="absolute -bottom-24 -left-24 hidden h-72 w-72 rounded-full bg-white/10 blur-3xl sm:block" />
      <div className="absolute inset-0 opacity-15 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:28px_28px]" />

      <div className="relative mx-auto max-w-3xl px-4 pb-24 pt-16 text-center sm:px-6">
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm backdrop-blur-none sm:backdrop-blur"
          >
            {eyebrow}
          </motion.span>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-5 text-4xl font-semibold md:text-5xl"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-4 max-w-xl text-lg text-white/80"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

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