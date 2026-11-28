import {
  BookOpen,
  CheckCircle2,
  FileText,
  GraduationCap,
  Heart,
  LayoutDashboard,
  PlusCircle,
  ShieldCheck,
  UserCog,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { DashboardRole } from "@/components/dashboard/types";

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type DashboardNavGroup = {
  title: string;
  items: DashboardNavItem[];
};

export const roleLabels: Record<DashboardRole, string> = {
  student: "Student",
  tutor: "Tutor",
  admin: "Admin",
};

export const dashboardNav: Record<DashboardRole, DashboardNavGroup[]> = {
  student: [
    {
      title: "Learning",
      items: [
        {
          label: "Overview",
          href: "/dashboard/student",
          icon: LayoutDashboard,
        },
        {
          label: "My Applications",
          href: "/dashboard/student/my-applications",
          icon: FileText,
        },
        {
          label: "Saved Tuitions",
          href: "/dashboard/student/saved",
          icon: Heart,
        },
      ],
    },
  ],

  tutor: [
    {
      title: "Teaching",
      items: [
        {
          label: "Overview",
          href: "/dashboard/tutor",
          icon: LayoutDashboard,
        },
        {
          label: "Post Tuition",
          href: "/dashboard/tutor/post-tuition",
          icon: PlusCircle,
        },
        {
          label: "My Tuitions",
          href: "/dashboard/tutor/my-tuitions",
          icon: BookOpen,
        },
        {
          label: "Applicants",
          href: "/dashboard/tutor/applicants",
          icon: Users,
        },
      ],
    },
  ],

  admin: [
    {
      title: "Administration",
      items: [
        {
          label: "Overview",
          href: "/dashboard/admin",
          icon: ShieldCheck,
        },
        {
          label: "Users",
          href: "/dashboard/admin/users",
          icon: Users,
        },
        {
          label: "Tuitions",
          href: "/dashboard/admin/tuitions",
          icon: GraduationCap,
        },
        {
          label: "Transactions",
          href: "/dashboard/admin/transactions",
          icon: Wallet,
        },
        {
          label: "bKash Approvals",
          href: "/dashboard/admin/bkash",
          icon: CheckCircle2,
        },
      ],
    },
  ],
};

export const accountNav: DashboardNavGroup = {
  title: "Account",
  items: [
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: UserCog,
    },
  ],
};

// Ei href gulo root, tai sub-route e active hobe na
const rootHrefs = [
  "/dashboard/student",
  "/dashboard/tutor",
  "/dashboard/admin",
  "/dashboard/profile",
];

export function isNavItemActive(pathname: string, href: string) {
  if (pathname === href) {
    return true;
  }

  if (rootHrefs.includes(href)) {
    return false;
  }

  return pathname.startsWith(href + "/");
}

export function findNavLocation(pathname: string, role: DashboardRole) {
  const groups = [...dashboardNav[role], accountNav];

  const entries = groups.flatMap((group) =>
    group.items.map((item) => ({ group, item }))
  );

  const exact = entries.find((entry) => entry.item.href === pathname);
  if (exact) {
    return exact;
  }

  const nested = entries
    .filter((entry) => pathname.startsWith(entry.item.href + "/"))
    .sort((a, b) => b.item.href.length - a.item.href.length);

  if (nested.length > 0) {
    return nested[0];
  }

  return null;
}