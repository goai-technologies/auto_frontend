import { apiRequest } from "./client";
import type { Paginated, UserItem } from "./types";

export interface UsersListParams {
  q?: string;
  page?: number;
  page_size?: number;
}

export function listUsers(params: UsersListParams = {}) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.page) search.set("page", String(params.page));
  if (params.page_size) search.set("page_size", String(params.page_size));
  const qs = search.toString();
  return apiRequest<Paginated<UserItem>>(`/users${qs ? `?${qs}` : ""}`);
}

export function createUser(body: { name: string; email: string; role: "admin" | "operator"; password?: string }) {
  return apiRequest<UserItem>("/users", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function getUser(userId: string) {
  return apiRequest<UserItem>(`/users/${encodeURIComponent(userId)}`);
}

export function updateUser(userId: string, body: Partial<Pick<UserItem, "role" | "is_active" | "name">>) {
  return apiRequest<UserItem>(`/users/${encodeURIComponent(userId)}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}
