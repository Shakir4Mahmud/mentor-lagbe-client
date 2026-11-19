import StudentOverview from "@/components/dashboard/StudentOverview";

export default function StudentDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold">Student Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Track your applications and learning plan.
      </p>

      <div className="mt-8">
        <StudentOverview />
      </div>
    </div>
  );
}