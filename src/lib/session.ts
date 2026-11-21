import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";

// Server e logged in user ke ana (ek request e ekbar-i check hobe)
export const getCurrentUser = cache(async () => {
  const requestHeaders = await headers();
  const session = await getAuth().api.getSession({ headers: requestHeaders });

  if (!session) {
    return null;
  }

  return session.user;
});

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