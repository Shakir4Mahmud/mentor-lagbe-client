import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, MailCheck } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import ResendVerificationButton from "@/components/auth/ResendVerificationButton";

export const metadata = {
  title: "Verify Email | GuruLagbe",
};

async function VerifyEmailContent({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = await searchParams;
  const queryEmail = typeof params.email === "string" ? params.email : undefined;
  const user = await getCurrentUser();
  const email = user?.email || queryEmail || "";

  if (email === "") {
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

  if (user?.emailVerified) {
    return (
      <div>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold">Email verified</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          <strong>{email}</strong> is verified. You can continue to your
          dashboard.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block text-sm font-semibold text-primary hover:underline"
        >
          Go to dashboard
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
        We sent a verification link to <strong>{email}</strong>. Open it to
        confirm your address. The link expires in 15 minutes. Sign in again
        after verifying.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <ResendVerificationButton email={email} />
        <Link
          href="/sign-in"
          className="text-sm font-semibold text-primary hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
      <VerifyEmailContent searchParams={searchParams} />
    </Suspense>
  );
}
