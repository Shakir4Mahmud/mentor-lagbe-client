import PageHeader from "@/components/shared/PageHeader";
import PricingSection from "@/components/home/PricingSection";
import Faq from "@/components/home/Faq";

export const metadata = {
  title: "Pricing | MentorLagbe",
};

export default function PricingPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Pricing"
        title="Simple plans for students and tutors"
        subtitle="Start for free. Upgrade to Pro when you are ready for more."
      />
      <PricingSection withHeading={false} />
      <Faq />
    </div>
  );
}