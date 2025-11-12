import { http, HttpResponse } from "msw";
import { users } from "./db.seed";

export const handlers = [
  http.get("/api/users", ({ request }) => {
    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get("page") || 1));
    const perPage = Math.max(
      1,
      Math.min(100, Number(url.searchParams.get("perPage") || 100))
    );
    const start = (page - 1) * perPage;
    const items = users.slice(start, start + perPage);
    return HttpResponse.json({ total: users.length, items });
  }),

  http.get("/api/users/:id", ({ params }) => {
    const user = users.find((u) => u.id === params.id);
    return user
      ? HttpResponse.json(user)
      : HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),
];
