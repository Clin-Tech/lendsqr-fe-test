import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UsersPage from "./UsersPage";

test("renders users, paginates, and sorts", async () => {
  render(
    <MemoryRouter>
      <UsersPage />
    </MemoryRouter>
  );

  expect(screen.getByText(/Loading/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
  });
  expect(screen.getByRole("table")).toBeInTheDocument();

  const prev = screen.getByRole("button", { name: "‹" });
  const next = screen.getByRole("button", { name: "›" });
  expect(prev).toBeDisabled();
  fireEvent.click(next);

  fireEvent.click(screen.getByRole("button", { name: /Sort by Username/i }));
});
