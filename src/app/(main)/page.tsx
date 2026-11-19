import Hero from "@/components/home/Hero";
import FeaturedSection from "@/components/home/FeaturedSection";
import PricingSection from "@/components/home/PricingSection";
import HowItWorks from "@/components/home/HowItWorks";
import SubjectsAndStats from "@/components/home/SubjectsAndStats";
import Testimonials from "@/components/home/Testimonials";

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedSection />
      <SubjectsAndStats />
      <HowItWorks />
      <PricingSection />
      <Testimonials />
    </div>
  );
}