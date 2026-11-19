import SavedTuitions from "@/components/dashboard/SavedTuitions";

export default function SavedTuitionsPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold">Saved Tuitions</h1>
      <p className="mt-2 text-muted-foreground">
        Tuitions you saved to check later.
      </p>

      <div className="mt-8">
        <SavedTuitions />
      </div>
    </div>
  );
}