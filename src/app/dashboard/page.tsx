import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { roleDashboardPath } from "@/lib/dashboard-path";

// Login kora user /dashboard e asle tar role er dashboard e pathiye dao
export default async function DashboardIndexPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in?redirect=/dashboard");
  }

  redirect(roleDashboardPath(user.role));
}
