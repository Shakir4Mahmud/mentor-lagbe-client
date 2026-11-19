import RoleGuard from "@/components/dashboard/RoleGuard";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleGuard role="student">{children}</RoleGuard>;
}