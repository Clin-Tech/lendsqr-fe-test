import { getUser } from "../api/users";

test("caches user detail in localStorage", async () => {
  const id = "u_0001";
  localStorage.removeItem(`user:${id}`);
  const u1 = await getUser(id);
  expect(u1.id).toBe(id);

  const hacked = { ...u1, profile: { ...u1.profile, fullName: "Cached Name" } };
  localStorage.setItem(`user:${id}`, JSON.stringify(hacked));

  const u2 = await getUser(id);
  expect(u2.profile.fullName).toBe("Cached Name");
});
