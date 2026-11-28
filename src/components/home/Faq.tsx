"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";

const faqs = [
  {
    question: "Is GuruLagbe free to use?",
    answer:
      "Yes. Students can browse and apply for free, and tutors can post up to 2 tuitions for free. Pro plans unlock extra benefits.",
  },
  {
    question: "What do I get with the Pro Tutor plan?",
    answer:
      "You can post unlimited tuitions and get a verified badge on your profile, which helps students trust you more.",
  },
  {
    question: "What do I get with the Pro Student plan?",
    answer:
      "You get priority booking for popular batches, a Pro badge, unlimited saved tuitions and priority support.",
  },
  {
    question: "How do I pay for a Pro plan?",
    answer:
      "Payments are handled securely by Stripe Checkout. After a successful payment your account is upgraded to Pro automatically.",
  },
  {
    question: "Can I switch between Student and Tutor?",
    answer:
      "Each account has one role. If you want to both learn and teach, you can create a second account with a different email.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  function handleToggle(index: number) {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
      <SectionHeading
        eyebrow="FAQ"
        title="Questions you may have"
        subtitle="Quick answers about plans and payments."
      />

      <div className="mt-10 space-y-3">
        {faqs.map((item, index) => {
          const isOpen = openIndex === index;

          let iconClass = "h-5 w-5 shrink-0 text-primary transition-transform duration-300";
          if (isOpen) {
            iconClass = iconClass + " rotate-180";
          }

          return (
            <div
              key={item.question}
              className="overflow-hidden rounded-2xl border bg-card"
            >
              <button
                type="button"
                onClick={() => handleToggle(index)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold"
              >
                {item.question}
                <ChevronDown className={iconClass} />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}