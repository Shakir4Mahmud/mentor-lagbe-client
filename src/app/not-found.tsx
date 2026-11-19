import Link from "next/link";
import { Home, Search } from "lucide-react";
import StatusScreen from "@/components/shared/StatusScreen";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <StatusScreen
      code="404"
      title="Page not found"
      message="The page you are looking for does not exist or may have been moved."
    >
      <Button
        asChild
        size="lg"
        className="bg-accent text-accent-foreground hover:bg-accent/90"
      >
        <Link href="/">
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>

      <Button
        asChild
        size="lg"
        variant="outline"
        className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
      >
        <Link href="/tuitions">
          <Search className="mr-2 h-4 w-4" />
          Browse Tuitions
        </Link>
      </Button>
    </StatusScreen>
  );
}