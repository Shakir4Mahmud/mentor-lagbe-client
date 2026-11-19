import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  let userName = "";
  if (user) {
    userName = user.name;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold">Update Profile</h1>
      <p className="mt-3 text-muted-foreground">Hello, {userName}</p>
      <Button asChild className="mt-6">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}