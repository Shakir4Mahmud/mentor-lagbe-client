"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { roleDashboardPath, safeRedirectPath } from "@/lib/dashboard-path";
import GoogleSignInButton, {
  googleLoginEnabled,
} from "@/components/auth/GoogleSignInButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormErrors = {
  email?: string;
  password?: string;
};

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // login er por kothay jabe
  const redirectParam = searchParams.get("redirect");
  const explicitRedirect = safeRedirectPath(redirectParam);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  function validateForm() {
    const newErrors: FormErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.trim() === "") {
      newErrors.email = "Email is required";
    } else if (!emailPattern.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (password === "") {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    const errorCount = Object.keys(newErrors).length;
    if (errorCount === 0) {
      return true;
    }
    return false;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    setLoading(true);

    const result = await authClient.signIn.email({
      email: email.trim(),
      password: password,
    });

    if (result.error) {
      let message = "Invalid email or password";
      if (result.error.message) {
        message = result.error.message;
      }
      toast.error(message);
      setLoading(false);
      return;
    }

    toast.success("Welcome back!");
    setLoading(false);

    // role onujayi dashboard e pathao (redirect param thakle setai priority)
    const role = result.data?.user?.role;
    const destination = explicitRedirect ?? roleDashboardPath(role);

    router.replace(destination);
    router.refresh();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-semibold">Welcome back</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sign in to continue to your MentorLagbe dashboard.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-label="Show or hide password"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      {googleLoginEnabled && (
        <>
          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <GoogleSignInButton />
        </>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to MentorLagbe?{" "}
        <Link href="/sign-up" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </motion.div>
  );
}