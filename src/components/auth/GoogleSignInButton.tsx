"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

// NEXT_PUBLIC_ values are inlined at build time. Set this to "true" only after
// GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET exist in Vercel, so a deploy before
// the keys are added never shows a Google button that cannot work.
export const googleLoginEnabled =
  process.env.NEXT_PUBLIC_GOOGLE_LOGIN_ENABLED === "true";

type Props = {
  role?: "student" | "tutor";
  label?: string;
  variant?: "default" | "outline";
};

export default function GoogleSignInButton({
  role,
  label = "Continue with Google",
  variant = "outline",
}: Props) {
  const [loading, setLoading] = useState(false);

  if (!googleLoginEnabled) {
    return null;
  }

  async function handleGoogle() {
    setLoading(true);

    if (role) {
      const secure = window.location.protocol === "https:" ? "; Secure" : "";
      document.cookie = `ml_google_role=${role}; path=/; max-age=600; SameSite=Lax${secure}`;
    }

    const result = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });

    if (result.error) {
      toast.error("Could not sign in with Google. Use email/password or try again.");
      setLoading(false);
    }
    // On success Better Auth redirects to /dashboard, which routes by role.
  }

  return (
    <Button
      type="button"
      variant={variant}
      size="lg"
      className="w-full"
      onClick={handleGoogle}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <FcGoogle className="mr-2 h-5 w-5" />
      )}
      {loading ? "Connecting..." : label}
    </Button>
  );
}
