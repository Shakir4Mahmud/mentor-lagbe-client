import RoleGuard from "@/components/dashboard/RoleGuard";

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleGuard role="tutor">{children}</RoleGuard>;
}