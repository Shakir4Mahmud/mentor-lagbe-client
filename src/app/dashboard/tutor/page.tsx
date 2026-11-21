import TutorOverview from "@/components/dashboard/TutorOverview";

export default function TutorDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold">Tutor Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Your tuitions, applicants and plan at a glance.
      </p>

      <div className="mt-8">
        <TutorOverview />
      </div>
    </div>
  );
}