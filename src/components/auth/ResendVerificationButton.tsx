"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function ResendVerificationButton({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);

  async function handleResend() {
    setLoading(true);
    const result = await authClient.sendVerificationEmail({
      email,
      callbackURL: "/dashboard",
    });
    setLoading(false);

    if (result.error) {
      toast.error("Could not resend the email. Please try again.");
      return;
    }
    toast.success("Verification email sent");
  }

  return (
    <Button onClick={handleResend} disabled={loading} variant="outline">
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Send className="mr-2 h-4 w-4" />
      )}
      {loading ? "Sending..." : "Resend email"}
    </Button>
  );
}
