// lib/types.ts
export interface ServerUser {
  id: string;
  email: string;
  role: "SUPER_ADMIN" | "TENANT_ADMIN" | "AGENT";
  tenant: {
    id: string;
    name: string;
    logo?: string;
    status: string;
    subscription?: {
      status: string;
      plan: {
        name: string;
      };
    };
  };
}
