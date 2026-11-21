import PostTuitionForm from "@/components/dashboard/PostTuitionForm";

export default function PostTuitionPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold">Post a Tuition</h1>
      <p className="mt-2 text-muted-foreground">
        Create a new tuition batch. It goes live after admin approval.
      </p>

      <div className="mt-8">
        <PostTuitionForm />
      </div>
    </div>
  );
}