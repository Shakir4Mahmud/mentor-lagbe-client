import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { roleDashboardPath } from "@/lib/dashboard-path";

export default async function RedirectIfLoggedIn({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (user) {
    redirect(roleDashboardPath(user.role));
  }

  return <>{children}</>;
}