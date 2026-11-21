import AdminOverview from "@/components/dashboard/AdminOverview";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Platform statistics, approvals and members at a glance.
      </p>

      <div className="mt-8">
        <AdminOverview />
      </div>
    </div>
  );
}