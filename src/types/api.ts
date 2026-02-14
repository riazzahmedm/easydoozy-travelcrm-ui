export type UserRole = "SUPER_ADMIN" | "TENANT_ADMIN" | "AGENT";
export type TenantStatus = "ACTIVE" | "SUSPENDED";
export type SubscriptionStatus =
  | "ACTIVE"
  | "TRIAL"
  | "EXPIRED"
  | "SUSPENDED";

export type PlanLimits = {
  maxAgents: number;
  maxDestinations: number;
  maxPackages: number;
  mediaEnabled: boolean;
};

export type Plan = {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  limits: PlanLimits;
  createdAt: string;
  updatedAt: string;
};

export type TenantAdmin = {
  id: string;
  name: string;
  email: string;
};

export type TenantDetails = {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  color?: string | null;
  status: TenantStatus;
  users: TenantAdmin[];
  subscription?: {
    id: string;
    status: SubscriptionStatus;
    plan: Plan;
  } | null;
  _count: {
    users: number;
    destinations: number;
    packages: number;
  };
};

export type CreateTenantPayload = {
  tenantName: string;
  slug: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  planId?: string;
  logo?: string;
  color?: string;
};

export type CreateTenantResponse = {
  tenant: {
    id: string;
    name: string;
    slug: string;
    logo?: string | null;
    color?: string | null;
    status: TenantStatus;
  };
  admin: {
    id: string;
    email: string;
    role: UserRole;
  };
};
