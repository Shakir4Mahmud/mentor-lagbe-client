"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
};

export default function AnimatedCounter({
  value,
  suffix = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) {
      return;
    }

    const totalSteps = 40;
    const stepTime = 1600 / totalSteps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep = currentStep + 1;

      const progress = currentStep / totalSteps;
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const newCount = Math.round(value * easedProgress);
      setCount(newCount);

      if (currentStep >= totalSteps) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => {
      clearInterval(timer);
    };
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}