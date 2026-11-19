import Link from "next/link";
import { requireRole } from "@/lib/session";
import { Button } from "@/components/ui/button";

export default async function TutorDashboardPage() {
  const user = await requireRole("tutor");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold">Tutor Dashboard</h1>
      <p className="mt-3 text-muted-foreground">Welcome, {user.name}</p>
      <Button asChild className="mt-6">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}