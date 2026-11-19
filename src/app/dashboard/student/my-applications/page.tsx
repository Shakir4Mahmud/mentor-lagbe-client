import MyApplications from "@/components/dashboard/MyApplications";

export default function MyApplicationsPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold">My Applications</h1>
      <p className="mt-2 text-muted-foreground">
        All the tuitions you applied for and their current status.
      </p>

      <div className="mt-8">
        <MyApplications />
      </div>
    </div>
  );
}