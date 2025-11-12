import { http, HttpResponse } from "msw";
import { users } from "./db.seed";
import type { UserDetail } from "../types/user";

export const handlers = [
  // list
  http.get("/api/users", ({ request }: { request: Request }) => {
    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
    const perPage = Math.max(
      1,
      Math.min(100, Number(url.searchParams.get("perPage") ?? 100))
    );
    const start = (page - 1) * perPage;
    const items = users.slice(start, start + perPage);
    return HttpResponse.json({ total: users.length, items });
  }),

  // for details
  http.get("/api/users/:id", ({ params }: { params: { id: string } }) => {
    const id = params.id;
    const base = users.find((u) => u.id === id);
    if (!base) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }

    const detail: UserDetail = {
      ...base,
      tier: ((parseInt(base.id.slice(-1)) % 3) + 1) as 1 | 2 | 3,
      balance: 200_000_00,
      accountNumber: "9912345678",
      bank: "Providus Bank",
      profile: {
        fullName: `${base.username} Effiom`,
        phone: base.phone,
        email: base.email.replace(/@.*/, "@gmail.com"),
        bvn: "07060780922",
        gender: "Female",
        maritalStatus: "Single",
        children: "None",
        residence: "Parent's Apartment",
      },
      education: {
        level: "B.Sc",
        employmentStatus: "Employed",
        sector: "FinTech",
        duration: "2 years",
        officeEmail: "grace@lendstar.com",
        incomeRange: ["₦200,000.00", "₦400,000.00"],
        repayment: "40,000",
      },
      socials: {
        twitter: "@grace_effiom",
        facebook: "Grace Effiom",
        instagram: "@grace_effiom",
      },
      guarantors: [
        {
          fullName: "Debby Ogana",
          phone: "07060780922",
          email: "debby@gmail.com",
          relationship: "Sister",
        },
        {
          fullName: "Debby Ogana",
          phone: "07060780922",
          email: "debby@gmail.com",
          relationship: "Sister",
        },
      ],
    };

    return HttpResponse.json(detail);
  }),
];
