"use client";

import Link from "next/link";
import { Home, RotateCcw } from "lucide-react";
import StatusScreen from "@/components/shared/StatusScreen";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <StatusScreen
      code="500"
      title="Something went wrong"
      message="An unexpected error happened. Please try again, or go back to the home page."
    >
      <Button
        size="lg"
        onClick={() => reset()}
        className="bg-accent text-accent-foreground hover:bg-accent/90"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Try Again
      </Button>

      <Button
        asChild
        size="lg"
        variant="outline"
        className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
      >
        <Link href="/">
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>
    </StatusScreen>
  );
}