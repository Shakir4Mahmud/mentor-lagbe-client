"use client";

import { useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "motion/react";
import { Star, Quote } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";

type Testimonial = {
  name: string;
  role: string;
  text: string;
  rating: number;
};

const testimonials: Testimonial[] = [
  {
    name: "Ayesha Siddika",
    role: "Student, SSC",
    text: "I found a math tutor in two days. The application process was so simple and my tutor replied the same evening.",
    rating: 5,
  },
  {
    name: "Tanvir Ahmed",
    role: "Tutor, Programming",
    text: "Posting my batch took five minutes. After approval I received applications from serious students right away.",
    rating: 5,
  },
  {
    name: "Imran Hossain",
    role: "Student, HSC",
    text: "Filtering by class level and mode saved me so much time. I could finally find an offline physics batch near my home.",
    rating: 4,
  },
  {
    name: "Farhana Akter",
    role: "Tutor, IELTS",
    text: "The dashboard makes it easy to manage applicants. Accepting or rejecting a student is just one click.",
    rating: 5,
  },
  {
    name: "Mitu Rahman",
    role: "Student, University",
    text: "The Pro plan priority booking helped me get a seat in a popular spoken English batch before it filled up.",
    rating: 5,
  },
  {
    name: "Rahim Uddin",
    role: "Tutor, Mathematics",
    text: "The verified badge gave parents more trust in me. My number of students has doubled in two months.",
    rating: 5,
  },
];

export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [paused, setPaused] = useState(false);

  // 2 bar rakhlam jate scroll kokhono thame na
  const loopItems = [...testimonials, ...testimonials];

  // Protita frame e card gulo ektu kore bam e soriye dey
  useAnimationFrame((time, delta) => {
    if (paused) {
      return;
    }

    const track = trackRef.current;
    if (!track) {
      return;
    }

    // track er adhek porjonto gele shuru te fire ashbe
    const halfWidth = track.scrollWidth / 2;

    // 0.04 pixel per millisecond = 40 pixel per second
    let newX = x.get() - delta * 0.04;

    if (newX <= -halfWidth) {
      newX = newX + halfWidth;
    }

    x.set(newX);
  });

  return (
    <section className="overflow-hidden bg-muted/50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Testimonials"
          title="Loved by students and tutors"
          subtitle="Real stories from people who learn and teach on MentorLagbe."
        />
      </div>

      <div
        className="mt-12 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <motion.div ref={trackRef} style={{ x: x }} className="flex w-max">
          {loopItems.map((item, index) => {
            const initial = item.name.charAt(0).toUpperCase();
            const stars = [1, 2, 3, 4, 5];

            return (
              <div
                key={index}
                className="mr-6 flex w-[320px] shrink-0 flex-col rounded-2xl border bg-card p-6 shadow-sm sm:w-[360px]"
              >
                <Quote className="h-8 w-8 text-accent" />

                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {item.text}
                </p>

                <div className="mt-4 flex items-center gap-1">
                  {stars.map((star) => {
                    let starClass = "h-4 w-4 text-border";
                    if (star <= item.rating) {
                      starClass = "h-4 w-4 fill-accent text-accent";
                    }
                    return <Star key={star} className={starClass} />;
                  })}
                </div>

                <div className="mt-4 flex items-center gap-3 border-t pt-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {initial}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.role}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}