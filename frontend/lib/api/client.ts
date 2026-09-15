const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export type ApiErrorPayload = {
  message?: string;
  error?: string | {
    message?: string;
  };
  code?: string;
};

export async function apiRequest<T>(
  endpoint: string,
  init: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers = new Headers(init.headers);

  if (!(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...init,
    headers,
    credentials: "include",
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof payload === "string"
      ? payload
      : payload?.message
        ?? (typeof payload?.error === "string" ? payload.error : payload?.error?.message)
        ?? "Something went wrong";

    throw new Error(message || "Something went wrong");
  }

  return (payload ?? null) as T;
}
