export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Login kora user er token ana
export async function getToken(): Promise<string | null> {
  const res = await fetch("/api/token");

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return data.token;
}

// Login lagbe na, shobar jonno (jemon tuition list)
export async function publicFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  const res = await fetch(API_URL + path, {
    ...options,
    headers: headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data as T;
}

// Login lagbe, token shoho pathay (protected route)
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", "Bearer " + token);
  }

  const res = await fetch(API_URL + path, {
    ...options,
    headers: headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data as T;
}