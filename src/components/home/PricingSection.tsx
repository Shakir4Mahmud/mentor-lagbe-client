"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  Crown,
  GraduationCap,
  BookOpen,
  Lock,
  CreditCard,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import BkashPayment from "@/components/payment/BkashPayment";
import SectionHeading from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";

type PlanInfo = {
  price: number;
  proTitle: string;
  freeFeatures: string[];
  proFeatures: string[];
};

const plans: Record<string, PlanInfo> = {
  student: {
    price: 99,
    proTitle: "Pro Student",
    freeFeatures: [
      "Browse and search all tuitions",
      "Apply to tuitions",
      "Track application status",
      "Basic student profile",
    ],
    proFeatures: [
      "Everything in Free",
      "Priority booking for popular batches",
      "Pro badge on your profile",
      "Unlimited saved tuitions",
      "Priority support",
    ],
  },
  tutor: {
    price: 199,
    proTitle: "Pro Tutor",
    freeFeatures: [
      "Post up to 2 tuitions",
      "Manage student applicants",
      "Edit and close your listings",
      "Basic tutor profile",
    ],
    proFeatures: [
      "Everything in Free",
      "Unlimited tuition posts",
      "Verified badge on your profile",
      "Higher trust from students",
      "Priority support",
    ],
  },
};

// Build-time public flag: hide SSLCommerz until its server keys are configured.
const sslcommerzEnabled =
  process.env.NEXT_PUBLIC_SSLCOMMERZ_ENABLED === "true";

type PricingSectionProps = {
  withHeading?: boolean;
};

export default function PricingSection({
  withHeading = true,
}: PricingSectionProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  // user nijer click korle ekhane save hobe, na korle null thakbe
  const [chosenAudience, setChosenAudience] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [activeGateway, setActiveGateway] = useState<"stripe" | "ssl">(
    "stripe"
  );

  // login kora user er role ar plan
  const user = session?.user;
  let userRole = "";
  let userPlan = "free";

  if (user) {
    if (user.role) {
      userRole = user.role;
    }
    if (user.plan) {
      userPlan = user.plan;
    }
  }

  // kon tab dekhabe seta hishab kora hoy
  let audience = "student";

  if (chosenAudience) {
    audience = chosenAudience;
  } else if (userRole === "tutor") {
    audience = "tutor";
  }

  const plan = plans[audience];

  // Pro button er text ar disabled state
  let proButtonText = "Subscribe with Stripe (test)";
  let proDisabled = false;

  if (user) {
    if (userRole === "admin") {
      proButtonText = "Admins cannot subscribe";
      proDisabled = true;
    } else if (userRole !== audience) {
      proButtonText = "For " + audience + " accounts only";
      proDisabled = true;
    } else if (userPlan === "pro") {
      proButtonText = "You are on Pro";
      proDisabled = true;
    }
  }

  async function handleSubscribe(gateway: "stripe" | "ssl") {
    // login na thakle sign in e pathao, login er por abar pricing e ashbe
    if (!user) {
      router.push("/sign-in?redirect=/pricing");
      return;
    }

    setActiveGateway(gateway);
    setCheckingOut(true);

    try {
      const endpoint =
        gateway === "ssl"
          ? "/api/payments/ssl/create"
          : "/api/payments/create-checkout-session";

      const data = await apiFetch<{ url: string }>(endpoint, {
        method: "POST",
      });

      window.location.href = data.url;
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
      setCheckingOut(false);
    }
  }

  function tabClass(tabName: string) {
    let base =
      "relative flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-colors ";
    if (audience === tabName) {
      base = base + "text-primary-foreground";
    } else {
      base = base + "text-muted-foreground hover:text-foreground";
    }
    return base;
  }

  return (
    <section
      id="pricing"
      className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6"
    >
      {withHeading && (
        <SectionHeading
          eyebrow="Pricing"
          title="Choose the plan that fits you"
          subtitle="Start free, upgrade to Pro anytime for more power. Simple and transparent pricing."
        />
      )}

      {/* Student / Tutor toggle */}
      <div className="mt-10 flex justify-center">
        <div className="inline-flex rounded-full border bg-card p-1.5 shadow-sm">
          <button
            type="button"
            onClick={() => setChosenAudience("student")}
            className={tabClass("student")}
          >
            {audience === "student" && (
              <motion.span
                layoutId="pricing-tab"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <GraduationCap className="relative z-10 h-4 w-4" />
            <span className="relative z-10">For Students</span>
          </button>

          <button
            type="button"
            onClick={() => setChosenAudience("tutor")}
            className={tabClass("tutor")}
          >
            {audience === "tutor" && (
              <motion.span
                layoutId="pricing-tab"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <BookOpen className="relative z-10 h-4 w-4" />
            <span className="relative z-10">For Tutors</span>
          </button>
        </div>
      </div>

      {/* Plan cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={audience}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35 }}
          className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2"
        >
          {/* Free card */}
          <div className="flex h-full flex-col rounded-3xl border bg-card p-8 shadow-sm">
            <h3 className="text-xl font-semibold">Free</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Everything you need to get started
            </p>

            <div className="mt-6 flex items-end gap-2">
              <span className="font-heading text-5xl font-bold">0</span>
              <span className="mb-1 text-sm text-muted-foreground">
                BDT / forever
              </span>
            </div>

            <ul className="mt-8 flex-1 space-y-3">
              {plan.freeFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                    <Check className="h-3 w-3" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              {user ? (
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full rounded-full"
                  disabled
                >
                  Included in your account
                </Button>
              ) : (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full rounded-full"
                >
                  <Link href={"/sign-up?role=" + audience}>
                    Get Started Free
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Pro card */}
          <div className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-hero-gradient p-8 text-white shadow-2xl shadow-primary/30">
            <div className="absolute -right-16 -top-16 hidden h-48 w-48 rounded-full bg-accent/25 blur-3xl sm:block" />

            <span className="absolute right-6 top-6 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
              Most Popular
            </span>

            <h3 className="relative flex items-center gap-2 text-xl font-semibold">
              <Crown className="h-5 w-5 text-accent" />
              {plan.proTitle}
            </h3>
            <p className="relative mt-1 text-sm text-white/70">
              Unlock the full MentorLagbe experience
            </p>

            <div className="relative mt-6 flex items-end gap-2">
              <span className="font-heading text-5xl font-bold">
                {plan.price}
              </span>
              <span className="mb-1 text-sm text-white/70">
                BDT / one-time
              </span>
            </div>

            <ul className="relative mt-8 flex-1 space-y-3">
              {plan.proFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm text-white/90"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/25 text-accent">
                    <Check className="h-3 w-3" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="relative mt-8 space-y-3">
              {proDisabled ? (
                <Button
                  size="lg"
                  disabled
                  className="w-full rounded-full bg-accent text-accent-foreground"
                >
                  {proButtonText}
                </Button>
              ) : sslcommerzEnabled ? (
                <>
                  <Button
                    size="lg"
                    onClick={() => handleSubscribe("ssl")}
                    disabled={checkingOut}
                    className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    {checkingOut && activeGateway === "ssl" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CreditCard className="mr-2 h-4 w-4" />
                    )}
                    Pay with SSLCommerz
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => handleSubscribe("stripe")}
                    disabled={checkingOut}
                    className="w-full rounded-full border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                  >
                    {checkingOut && activeGateway === "stripe" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CreditCard className="mr-2 h-4 w-4" />
                    )}
                    Pay with Stripe (test)
                  </Button>
                  <BkashPayment price={plan.price} />
                </>
              ) : (
                <>
                  <Button
                    size="lg"
                    onClick={() => handleSubscribe("stripe")}
                    disabled={checkingOut}
                    className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    {checkingOut ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CreditCard className="mr-2 h-4 w-4" />
                    )}
                    {checkingOut
                      ? "Redirecting to Stripe..."
                      : proButtonText}
                  </Button>
                  <BkashPayment price={plan.price} />
                </>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Lock className="h-4 w-4" />
        {sslcommerzEnabled
          ? "Secure payments powered by SSLCommerz and Stripe (test mode)"
          : "Secure payment powered by Stripe (test mode)"}
      </p>
    </section>
  );
}