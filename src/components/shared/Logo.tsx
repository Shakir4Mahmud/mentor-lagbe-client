import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <GraduationCap className="h-5 w-5" />
      </span>
      <span className="font-heading text-xl font-semibold tracking-tight">
        Mentor<span className="text-accent">Lagbe</span>
      </span>
    </Link>
  );
}