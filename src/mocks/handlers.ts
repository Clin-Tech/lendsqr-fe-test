import { http, HttpResponse } from "msw";
import { USERS } from "./db.seed";

export const handlers = [
  http.get("/api/users", ({ request }) => {
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") || "").toLowerCase();
    const page = Number(url.searchParams.get("page") || 1);
    const size = Number(url.searchParams.get("size") || 100);
    const sort = url.searchParams.get("sort") || "createdAt:desc";
    let data = USERS.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.includes(q)
    );
    const [k, dir] = sort.split(":");
    data.sort(
      (a: any, b: any) => (a[k] > b[k] ? 1 : -1) * (dir === "desc" ? -1 : 1)
    );
    const start = (page - 1) * size;
    return HttpResponse.json({
      items: data.slice(start, start + size),
      total: data.length,
    });
  }),
  http.get("/api/users/:id", ({ params }) => {
    const u = USERS.find((x) => x.id === params.id);
    return u
      ? HttpResponse.json(u)
      : HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),
];
