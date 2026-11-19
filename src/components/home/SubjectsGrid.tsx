"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Sigma,
  Atom,
  Code,
  Globe,
  FlaskConical,
  Dna,
  BookText,
  Microscope,
  ArrowUpRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SubjectCount } from "@/types";

type SubjectItem = {
  name: string;
  icon: LucideIcon;
};

const subjectList: SubjectItem[] = [
  { name: "Mathematics", icon: Sigma },
  { name: "Physics", icon: Atom },
  { name: "Programming", icon: Code },
  { name: "IELTS", icon: Globe },
  { name: "Chemistry", icon: FlaskConical },
  { name: "Biology", icon: Dna },
  { name: "English", icon: BookText },
  { name: "Science", icon: Microscope },
];

type SubjectsGridProps = {
  subjects: SubjectCount[];
};

function findCount(subjects: SubjectCount[], name: string) {
  for (let i = 0; i < subjects.length; i++) {
    if (subjects[i].name === name) {
      return subjects[i].count;
    }
  }
  return 0;
}

export default function SubjectsGrid({ subjects }: SubjectsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      {subjectList.map((subject, index) => {
        const Icon = subject.icon;
        const count = findCount(subjects, subject.name);

        let countText = count + " tuitions";
        if (count === 1) {
          countText = "1 tuition";
        }

        return (
          <motion.div
            key={subject.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: (index % 4) * 0.1 }}
            className="h-full"
          >
            <Link
              href={"/tuitions?subject=" + subject.name}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-5 transition duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
            >
              {/* Hover e halka gold glow */}
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/0 blur-2xl transition duration-500 group-hover:bg-accent/30" />

              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary transition duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-6 w-6" />
              </div>

              <h3 className="relative mt-4 text-lg font-semibold">
                {subject.name}
              </h3>

              <div className="relative mt-auto flex items-center justify-between pt-3">
                <p className="text-sm text-muted-foreground">{countText}</p>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}