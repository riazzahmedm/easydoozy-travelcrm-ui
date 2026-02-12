import { serverFetch } from "./server-api";

export async function getServerTenantById(id: string) {
  const res = await serverFetch(`/tenants/${id}`);

  if (!res.ok) return null;
  return res.json();
}