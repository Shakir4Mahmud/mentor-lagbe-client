import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import PageLoader from "@/components/shared/PageLoader";
import DashboardShell from "@/components/dashboard/DashboardShell";
import type { DashboardUser } from "@/components/dashboard/types";

export const metadata = {
  title: "Dashboard | MentorLagbe",
};

async function DashboardGuard({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (!user.emailVerified) {
    redirect("/verify-email");
  }

  let role: DashboardUser["role"] = "student";
  if (user.role === "tutor" || user.role === "admin") {
    role = user.role;
  }

  let plan = "free";
  if (user.plan) {
    plan = user.plan;
  }

  const dashboardUser: DashboardUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image ?? null,
    role: role,
    plan: plan,
  };

  return <DashboardShell user={dashboardUser}>{children}</DashboardShell>;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<PageLoader />}>
      <DashboardGuard>{children}</DashboardGuard>
    </Suspense>
  );
}