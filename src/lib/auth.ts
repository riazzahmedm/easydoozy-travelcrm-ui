export type UserRole = "SUPER_ADMIN" | "TENANT_ADMIN" | "AGENT";

export interface AuthUser {
  userId: string;
  role: UserRole;
  tenantId: string;
  email?: string;
}
