import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import UsersList from "./pages/Users/Users";
import UserDetails from "./pages/Users/UserDetails";
import AppShell from "./layout/AppShell";

export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  {
    path: "/",
    element: <AppShell />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "users", element: <UsersList /> },
      { path: "users/:id", element: <UserDetails /> },
    ],
  },
]);
