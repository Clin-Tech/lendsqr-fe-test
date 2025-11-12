import { faker } from "@faker-js/faker";
import type { User } from "../types/user";

faker.seed(2025);

const orgs = ["Lendsqr", "Irorun", "Lendstar"];
const statuses = ["Active", "Inactive", "Pending", "Blacklisted"] as const;

export const users: User[] = Array.from({ length: 500 }, (_, i) => ({
  id: `u_${String(i + 1).padStart(4, "0")}`,
  organization: faker.helpers.arrayElement(orgs),
  username: faker.person.firstName(),
  email: faker.internet.email().toLowerCase(),
  phone: faker.number
    .int({ min: 7000000000, max: 9099999999 })
    .toString()
    .replace(/(\d{4})(\d{3})(\d{3})/, "0$1$2$3"),
  dateJoined: faker.date
    .between({ from: "2019-01-01", to: "2020-12-31" })
    .toISOString(),
  status: faker.helpers.arrayElement(statuses),
}));
