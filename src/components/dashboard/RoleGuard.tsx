import { Suspense } from "react";
import { requireRole } from "@/lib/session";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";

type RoleGuardProps = {
  role: string;
  children: React.ReactNode;
};

async function RoleCheck({ role, children }: RoleGuardProps) {
  await requireRole(role);
  return <>{children}</>;
}

export default function RoleGuard({ role, children }: RoleGuardProps) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <RoleCheck role={role}>{children}</RoleCheck>
    </Suspense>
  );
}