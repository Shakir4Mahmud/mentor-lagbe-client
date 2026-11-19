import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TutorDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold">Tutor Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Your overview and stats will appear here soon.
      </p>

      <Button asChild variant="outline" className="mt-6">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}