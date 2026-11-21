import AdminTuitions from "@/components/dashboard/AdminTuitions";

export default function AdminTuitionsPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold">Tuitions</h1>
      <p className="mt-2 text-muted-foreground">
        Review tuitions posted by tutors. Approved tuitions go live for
        students.
      </p>

      <div className="mt-8">
        <AdminTuitions />
      </div>
    </div>
  );
}