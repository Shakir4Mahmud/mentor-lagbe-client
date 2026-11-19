import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Platform stats will appear here soon.
      </p>

      <Button asChild variant="outline" className="mt-6">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}