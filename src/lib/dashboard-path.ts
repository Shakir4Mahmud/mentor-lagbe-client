// User er role onujayi kon dashboard e jabe seta ber kore
export function roleDashboardPath(role?: string | null) {
  if (role === "tutor" || role === "admin") {
    return `/dashboard/${role}`;
  }

  return "/dashboard/student";
}

// Login er por redirect param safe kina check kore.
// Same-origin relative path chada kisu allow kori na — `//evil.com` ar
// `/\evil.com` (backslash bypass) duto-i block hoy.
export function safeRedirectPath(
  value: string | null | undefined,
  base?: string
) {
  if (!value || !value.startsWith("/")) {
    return null;
  }

  const origin =
    base ??
    (typeof window === "undefined" ? "http://localhost" : window.location.origin);

  try {
    const normalized = value.replace(/\\/g, "/");
    const url = new URL(normalized, origin);

    if (url.origin !== new URL(origin).origin || !url.pathname.startsWith("/")) {
      return null;
    }

    return url.pathname + url.search + url.hash;
  } catch {
    return null;
  }
}
