import { Task, User } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const TOKEN_KEY = "auth_token";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

type Options = RequestInit & { auth?: boolean };

async function request<T>(path: string, options: Options = {}): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (options.auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = body.message || "Request failed";
    throw new Error(message);
  }

  return res.json();
}

export function signup(payload: {
  name: string;
  email: string;
  password: string;
}) {
  return request<{ token: string; user: User }>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload: { email: string; password: string }) {
  return request<{ token: string; user: User }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchProfile() {
  return request<{ user: User }>("/profile", { auth: true });
}

export function updateProfile(payload: Partial<User>) {
  return request<{ user: User }>("/profile", {
    method: "PUT",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export function fetchTasks(params?: {
  search?: string;
  status?: string;
  tag?: string;
}) {
  const qs = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== "")
    )
  );
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return request<{ tasks: Task[] }>(`/tasks${suffix}`, { auth: true });
}

export function createTask(task: Partial<Task>) {
  return request<{ task: Task }>("/tasks", {
    method: "POST",
    auth: true,
    body: JSON.stringify(task),
  });
}

export function updateTask(id: string, task: Partial<Task>) {
  return request<{ task: Task }>(`/tasks/${id}`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify(task),
  });
}

export function deleteTask(id: string) {
  return request<{ message: string }>(`/tasks/${id}`, {
    method: "DELETE",
    auth: true,
  });
}

