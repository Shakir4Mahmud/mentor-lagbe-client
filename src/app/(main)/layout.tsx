import { Suspense } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import Logo from "@/components/shared/Logo";

// Navbar load hoyar age ei simple navbar dekhabe (height ek-i, tai page lafay na)
function NavbarFallback() {
  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full border border-border bg-card/70 px-5 backdrop-blur-xl">
        <Logo />
        <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
      </div>
    </header>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<NavbarFallback />}>
        <Navbar />
      </Suspense>

      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}