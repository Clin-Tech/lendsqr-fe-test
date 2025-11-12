import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import AppShell from "./layout/AppShell";
import SectionPlaceholder from "./pages/SectionPlaceholder/SectionPlaceholder";
import UsersPage from "./pages/UsersPage/UsersPage";

export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  {
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/customers/users" replace /> },

      {
        path: "dashboard",
        element: <SectionPlaceholder />,
        handle: { title: "Dashboard" },
      },

      {
        path: "customers/users",
        element: <UsersPage />,
        handle: { title: "Users" },
      },
      {
        path: "customers/guarantors",
        element: <SectionPlaceholder />,
        handle: { title: "Guarantors" },
      },
      {
        path: "customers/loans",
        element: <SectionPlaceholder />,
        handle: { title: "Loans" },
      },
      {
        path: "customers/decision-models",
        element: <SectionPlaceholder />,
        handle: { title: "Decision Models" },
      },
      {
        path: "customers/savings",
        element: <SectionPlaceholder />,
        handle: { title: "Savings" },
      },
      {
        path: "customers/loan-requests",
        element: <SectionPlaceholder />,
        handle: { title: "Loan Requests" },
      },
      {
        path: "customers/whitelist",
        element: <SectionPlaceholder />,
        handle: { title: "Whitelist" },
      },
      {
        path: "customers/karma",
        element: <SectionPlaceholder />,
        handle: { title: "Karma" },
      },

      {
        path: "biz/org",
        element: <SectionPlaceholder />,
        handle: { title: "Organization" },
      },
      {
        path: "biz/loan-products",
        element: <SectionPlaceholder />,
        handle: { title: "Loan Products" },
      },
      {
        path: "biz/savings-products",
        element: <SectionPlaceholder />,
        handle: { title: "Savings Products" },
      },
      {
        path: "biz/fees",
        element: <SectionPlaceholder />,
        handle: { title: "Fees and Charges" },
      },
      {
        path: "biz/tx",
        element: <SectionPlaceholder />,
        handle: { title: "Transactions" },
      },
      {
        path: "biz/services",
        element: <SectionPlaceholder />,
        handle: { title: "Services" },
      },
      {
        path: "biz/service-account",
        element: <SectionPlaceholder />,
        handle: { title: "Service Account" },
      },
      {
        path: "biz/settlements",
        element: <SectionPlaceholder />,
        handle: { title: "Settlements" },
      },
      {
        path: "biz/reports",
        element: <SectionPlaceholder />,
        handle: { title: "Reports" },
      },

      {
        path: "settings/preferences",
        element: <SectionPlaceholder />,
        handle: { title: "Preferences" },
      },
      {
        path: "settings/fees-pricing",
        element: <SectionPlaceholder />,
        handle: { title: "Fees and Pricing" },
      },
      {
        path: "settings/audit-logs",
        element: <SectionPlaceholder />,
        handle: { title: "Audit Logs" },
      },

      { path: "*", element: <Navigate to="/customers/users" replace /> },
    ],
  },
]);
