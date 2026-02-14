import { serverFetch } from "./server-api";
import { TenantDetails } from "@/types/api";

export async function getServerTenantById(
  id: string
): Promise<TenantDetails | null> {
  const res = await serverFetch(`/tenants/${id}`);

  if (!res.ok) return null;
  return res.json() as Promise<TenantDetails>;
}
