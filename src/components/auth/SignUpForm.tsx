"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, GraduationCap, BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import GoogleSignInButton, {
  googleLoginEnabled,
} from "@/components/auth/GoogleSignInButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
};

export default function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // /sign-up?role=tutor hole tutor age thekei select thakbe
  const roleFromUrl = searchParams.get("role");
  let startRole = "student";
  if (roleFromUrl === "tutor") {
    startRole = "tutor";
  }

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(startRole);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  function validateForm() {
    const newErrors: FormErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name.trim() === "") {
      newErrors.name = "Full name is required";
    }

    if (email.trim() === "") {
      newErrors.email = "Email is required";
    } else if (!emailPattern.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (password === "") {
      newErrors.password = "Password is required";
    } else if (password.length < 10) {
      newErrors.password = "Password must be at least 10 characters";
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

    const result = await authClient.signUp.email({
      name: name.trim(),
      email: email.trim(),
      password: password,
      role: role,
      callbackURL: "/dashboard",
    });

    if (result.error) {
      let message = "Sign up failed. Please try again.";
      if (result.error.message) {
        message = result.error.message;
      }
      toast.error(message);
      setLoading(false);
      return;
    }

    setLoading(false);

    // Verification is required before sign-in, so send the user to the
    // verification page instead of straight to the dashboard.
    toast.success("Account created. Please verify your email.");
    router.replace("/verify-email?email=" + encodeURIComponent(email.trim()));
    router.refresh();
  }

  let studentCardClass =
    "flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-sm font-medium transition";
  let tutorCardClass = studentCardClass;

  if (role === "student") {
    studentCardClass = studentCardClass + " border-primary bg-secondary text-primary";
    tutorCardClass = tutorCardClass + " border-border text-muted-foreground hover:border-primary/40";
  } else {
    tutorCardClass = tutorCardClass + " border-primary bg-secondary text-primary";
    studentCardClass = studentCardClass + " border-border text-muted-foreground hover:border-primary/40";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-semibold">Create your account</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Join GuruLagbe and start your learning or teaching journey.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        {/* Role select */}
        <div className="space-y-2">
          <Label>I want to join as</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={studentCardClass}
            >
              <GraduationCap className="h-6 w-6" />
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("tutor")}
              className={tutorCardClass}
            >
              <BookOpen className="h-6 w-6" />
              Tutor
            </button>
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        {/* Email */}
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

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 characters"
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
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      {googleLoginEnabled && (
        <>
          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-3">
            <GoogleSignInButton role="student" label="Continue as Student" />
            <GoogleSignInButton role="tutor" label="Continue as Tutor" />
          </div>
        </>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-semibold text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </motion.div>
  );
}