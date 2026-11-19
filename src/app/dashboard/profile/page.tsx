import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import ProfileForm from "@/components/dashboard/ProfileForm";
import { Skeleton } from "@/components/ui/skeleton";

async function ProfileContent() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  let image = "";
  if (user.image) {
    image = user.image;
  }

  let phone = "";
  if (user.phone) {
    phone = user.phone;
  }

  let bio = "";
  if (user.bio) {
    bio = user.bio;
  }

  let role = "student";
  if (user.role) {
    role = user.role;
  }

  let plan = "free";
  if (user.plan) {
    plan = user.plan;
  }

  const profileUser = {
    name: user.name,
    email: user.email,
    image: image,
    phone: phone,
    bio: bio,
    role: role,
    plan: plan,
  };

  return <ProfileForm user={profileUser} />;
}

function ProfileLoading() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-1">
        <Skeleton className="h-80 w-full rounded-3xl" />
        <Skeleton className="h-40 w-full rounded-3xl" />
      </div>
      <Skeleton className="h-[480px] w-full rounded-3xl lg:col-span-2" />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold">Update Profile</h1>
      <p className="mt-2 text-muted-foreground">
        Manage your photo and personal details.
      </p>

      <div className="mt-8">
        <Suspense fallback={<ProfileLoading />}>
          <ProfileContent />
        </Suspense>
      </div>
    </div>
  );
}