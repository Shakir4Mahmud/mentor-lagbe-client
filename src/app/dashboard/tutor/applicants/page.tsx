import TutorApplicants from "@/components/dashboard/TutorApplicants";

export default function TutorApplicantsPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold">Applicants</h1>
      <p className="mt-2 text-muted-foreground">
        Review students who applied to your tuitions and accept or reject them.
      </p>

      <div className="mt-8">
        <TutorApplicants />
      </div>
    </div>
  );
}