import type { User } from "../types/user";

export type ListUsersParams = {
  page?: number;
  pageSize?: number;
  status?: string;
  org?: string;
  q?: string;
  sort?: "dateJoined" | "username" | "email";
  dir?: "asc" | "desc";
};

export type ListUsersResponse = {
  items: User[];
  total: number;
  page: number;
  pageSize: number;
};

export async function listUsers(
  params: ListUsersParams = {}
): Promise<ListUsersResponse> {
  const qs = new URLSearchParams(params as Record<string, string>);
  const res = await fetch(`/api/users?${qs.toString()}`);
  if (!res.ok) throw new Error("Failed to load users");
  return res.json();
}
