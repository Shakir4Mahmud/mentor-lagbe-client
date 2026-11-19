export type DashboardRole = "student" | "tutor" | "admin";

export type DashboardUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: DashboardRole;
  plan: string;
};