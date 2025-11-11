import { faker } from "@faker-js/faker";
export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive" | "Blacklisted" | "Pending";
  org: string;
  createdAt: string;
};
faker.seed(42);
export const USERS: User[] = Array.from({ length: 500 }).map(() => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  phone: faker.phone.number(),
  status: faker.helpers.arrayElement([
    "Active",
    "Inactive",
    "Blacklisted",
    "Pending",
  ]),
  org: faker.company.name(),
  createdAt: faker.date.past({ years: 2 }).toISOString(),
}));
