export type UserStatus = "Active" | "Inactive" | "Pending" | "Blacklisted";

export interface User {
  id: string;
  organization: string;
  username: string;
  email: string;
  phone: string;
  dateJoined: string; // ISO string format
  status: UserStatus;
}

export type UserDetail = User & {
  tier: 1 | 2 | 3;
  balance: number;
  accountNumber: string;
  bank: string;
  profile: {
    fullName: string;
    phone: string;
    email: string;
    bvn: string;
    gender: "Male" | "Female";
    maritalStatus: "Single" | "Married";
    children: "None" | "1" | "2+";
    residence: string;
  };
  education: {
    level: "B.Sc" | "M.Sc" | "PhD";
    employmentStatus: "Employed" | "Unemployed";
    sector: string;
    duration: string;
    officeEmail: string;
    incomeRange: [string, string];
    repayment: string;
  };
  socials: {
    twitter: string;
    facebook: string;
    instagram: string;
  };
  guarantors: Array<{
    fullName: string;
    phone: string;
    email: string;
    relationship: string;
  }>;
};
