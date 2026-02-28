const API_BASE_KEY = "casting.apiBase";
const TOKEN_KEY = "casting.token";

let apiBase = localStorage.getItem(API_BASE_KEY) ?? "http://localhost:3001";
let token = localStorage.getItem(TOKEN_KEY) ?? "";

export function getApiBase(): string {
  return apiBase;
}

export function setApiBase(base: string): void {
  apiBase = base.replace(/\/+$/, "") || "http://localhost:3001";
  localStorage.setItem(API_BASE_KEY, apiBase);
}

export function getToken(): string {
  return token;
}

export function setToken(value: string): void {
  token = value;
  if (value) {
    localStorage.setItem(TOKEN_KEY, value);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export async function request<T>(
  path: string,
  init?: {
    method?: "GET" | "POST" | "PATCH";
    body?: unknown;
  },
): Promise<T> {
  const body = init?.body;
  const headers = new Headers();
  const isFormData = body instanceof FormData;
  if (!isFormData) {
    headers.set("content-type", "application/json");
  }
  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }

  const fetchBody: BodyInit | undefined =
    body === undefined ? undefined : isFormData ? body : JSON.stringify(body);

  const response = await fetch(`${apiBase}${path}`, {
    method: init?.method ?? "GET",
    headers,
    body: fetchBody,
  });

  const text = await response.text();
  let payload: Record<string, unknown> = {};
  if (text) {
    try {
      payload = JSON.parse(text) as Record<string, unknown>;
    } catch {
      payload = {};
    }
  }

  if (!response.ok) {
    const message =
      typeof payload.error === "string"
        ? payload.error
        : `Erreur HTTP ${response.status}`;
    throw new Error(message);
  }

  return payload as T;
}

export function toIsoDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString();
}

export function formatDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
