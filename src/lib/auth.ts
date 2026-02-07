export type UserRole = "SUPER_ADMIN" | "TENANT_ADMIN" | "AGENT";

export interface AuthUser {
  id: string;
  role: UserRole;
  tenantId: string;
}
