// User er role onujayi kon dashboard e jabe seta ber kore
export function roleDashboardPath(role?: string | null) {
  if (role === "tutor" || role === "admin") {
    return `/dashboard/${role}`;
  }

  return "/dashboard/student";
}

// Login er por redirect param safe kina check kore (external URL block)
export function safeRedirectPath(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return null;
  }

  return value;
}
