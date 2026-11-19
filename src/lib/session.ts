import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

// Server e logged in user ke ana
export async function getCurrentUser() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session) {
    return null;
  }

  return session.user;
}

// Je role er page, sudhu sei role dhukte parbe
export async function requireRole(role: string) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  let userRole = "student";
  if (user.role) {
    userRole = user.role;
  }

  if (userRole !== role) {
    if (
      userRole === "student" ||
      userRole === "tutor" ||
      userRole === "admin"
    ) {
      redirect("/dashboard/" + userRole);
    }
    redirect("/");
  }

  return user;
}