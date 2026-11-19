import { Suspense } from "react";
import Logo from "@/components/shared/Logo";
import RedirectIfLoggedIn from "@/components/auth/RedirectIfLoggedIn";
import { CheckCircle2 } from "lucide-react";

const points = [
  "Verified tutors across every subject",
  "Online and offline tuition near you",
  "Simple applications and secure Pro plans",
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left branded panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-hero-gradient p-12 text-white lg:flex">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative [&_a>span:nth-child(2)]:text-white">
          <Logo />
        </div>

        <div className="relative">
          <h2 className="text-4xl font-semibold leading-tight">
            Learn better with the{" "}
            <span className="text-gold-gradient">right mentor</span>
          </h2>
          <ul className="mt-8 space-y-4">
            {points.map((point) => (
              <li key={point} className="flex items-center gap-3 text-white/85">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-white/60">
          MentorLagbe, smart tuition and mentorship platform
        </p>
      </div>

      {/* Right form area */}
      <div className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <Suspense fallback={null}>
            <RedirectIfLoggedIn>{children}</RedirectIfLoggedIn>
          </Suspense>
        </div>
      </div>
    </div>
  );
}