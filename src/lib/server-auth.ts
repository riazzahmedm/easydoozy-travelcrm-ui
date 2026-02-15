import { serverFetch } from "./server-api";
import { AuthUser } from "./auth";

type LegacyMeResponse = {
  id: string;
  email?: string;
  role: AuthUser["role"];
  tenant?: {
    id: string;
  } | null;
};

type CurrentMeResponse = {
  userId: string;
  tenantId?: string | null;
  email?: string;
  role: AuthUser["role"];
};

function toAuthUser(data: unknown): AuthUser | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const raw = data as Partial<CurrentMeResponse & LegacyMeResponse>;
  const role = raw.role;
  const email = typeof raw.email === "string" ? raw.email : undefined;

  if (!role) {
    return null;
  }

  if (typeof raw.userId === "string") {
    return {
      userId: raw.userId,
      tenantId: raw.tenantId ?? "",
      role,
      email,
    };
  }

  if (typeof raw.id === "string") {
    return {
      userId: raw.id,
      tenantId: raw.tenant?.id ?? "",
      role,
      email,
    };
  }

  return null;
}

export async function getServerUser(): Promise<AuthUser | null> {
  const res = await serverFetch("/auth/me");

  if (!res.ok) return null;

  const data: unknown = await res.json();
  return toAuthUser(data);
}
