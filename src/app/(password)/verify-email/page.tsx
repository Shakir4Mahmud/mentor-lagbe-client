import { Suspense } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import ResendVerificationButton from "@/components/auth/ResendVerificationButton";

export const metadata = {
  title: "Verify Email | MentorLagbe",
};

async function VerifyEmailContent() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div>
        <h1 className="text-2xl font-semibold">Sign in required</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Please sign in to manage email verification.
        </p>
        <Link
          href="/sign-in"
          className="mt-6 inline-block text-sm font-semibold text-primary hover:underline"
        >
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <MailCheck className="h-7 w-7" />
      </div>
      <h1 className="mt-6 text-2xl font-semibold">Verify your email</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We sent a verification link to <strong>{user.email}</strong>. Open it to
        confirm your address. The link expires in 15 minutes.
      </p>
      <div className="mt-8 flex items-center gap-3">
        <ResendVerificationButton email={user.email} />
        <Link
          href="/dashboard"
          className="text-sm font-semibold text-primary hover:underline"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
