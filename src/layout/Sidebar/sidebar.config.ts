import {
  AuditLogs,
  Dashboard,
  DecisionModels,
  Fees,
  Guarantors,
  Karma,
  LoanRequest,
  Loans,
  Preferences,
  Pricing,
  Reports,
  Savings,
  SavingsProducts,
  ServiceAccount,
  Services,
  Settlements,
  SwitchOrg,
  Transactions,
  Users,
  WhiteList,
} from "../../assets/images";

export type NavItem = { label: string; to: string; icon: string; alt?: string };
export type NavSection = { title?: string; items: NavItem[] };

export const SIDEBAR_SECTIONS: NavSection[] = [
  {
    items: [{ label: "Dashboard", to: "/dashboard", icon: Dashboard }],
  },
  {
    title: "Customers",
    items: [
      { label: "Users", to: "/customers/users", icon: Users },
      { label: "Guarantors", to: "/customers/guarantors", icon: Guarantors },
      { label: "Loans", to: "/customers/loans", icon: Loans },
      {
        label: "Decision Models",
        to: "/customers/decision-models",
        icon: DecisionModels,
      },
      { label: "Savings", to: "/customers/savings", icon: Savings },
      {
        label: "Loan Requests",
        to: "/customers/loan-requests",
        icon: LoanRequest,
      },
      { label: "Whitelist", to: "/customers/whitelist", icon: WhiteList },
      { label: "Karma", to: "/customers/karma", icon: Karma },
    ],
  },
  {
    title: "Businesses",
    items: [
      { label: "Organization", to: "/biz/org", icon: SwitchOrg },
      { label: "Loan Products", to: "/biz/loan-products", icon: LoanRequest },
      {
        label: "Savings Products",
        to: "/biz/savings-products",
        icon: SavingsProducts,
      },
      { label: "Fees and Charges", to: "/biz/fees", icon: Fees },
      { label: "Transactions", to: "/biz/tx", icon: Transactions },
      { label: "Services", to: "/biz/services", icon: Services },
      {
        label: "Service Account",
        to: "/biz/service-account",
        icon: ServiceAccount,
      },
      { label: "Settlements", to: "/biz/settlements", icon: Settlements },
      { label: "Reports", to: "/biz/reports", icon: Reports },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Preferences", to: "/settings/preferences", icon: Preferences },
      {
        label: "Fees and Pricing",
        to: "/settings/fees-pricing",
        icon: Pricing,
      },
      { label: "Audit Logs", to: "/settings/audit-logs", icon: AuditLogs },
    ],
  },
];
