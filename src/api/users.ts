import type { User, UserDetail } from "../types/user";

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
  const qs = new URLSearchParams();
  if (params.page != null) qs.set("page", String(params.page));
  if (params.pageSize != null) qs.set("perPage", String(params.pageSize));
  if (params.status) qs.set("status", params.status);
  if (params.org) qs.set("org", params.org);
  if (params.q) qs.set("q", params.q);
  if (params.sort) qs.set("sort", params.sort);
  if (params.dir) qs.set("dir", params.dir);

  const res = await fetch(`/api/users?${qs.toString()}`);
  if (!res.ok) throw new Error("Failed to load users");
  return (await res.json()) as ListUsersResponse;
}

export async function getUser(id: string): Promise<UserDetail> {
  const key = `user:${id}`;

  const cached = localStorage.getItem(key);
  if (cached) {
    try {
      return JSON.parse(cached) as UserDetail;
    } catch {
      localStorage.removeItem(key);
    }
  }

  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error(`User ${id} not found`);
  const data = (await res.json()) as UserDetail;

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    /* ignore */
  }

  return data;
}
