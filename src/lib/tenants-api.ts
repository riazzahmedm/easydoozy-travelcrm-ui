import { api } from "./api";

export async function getTenants() {
  const res = await api.get("/tenants");
  return res.data;
}

export async function updateTenantStatus(
  id: string,
  status: "ACTIVE" | "SUSPENDED"
) {
  const res = await api.patch(`/tenants/${id}/status`, {
    status,
  });
  return res.data;
}

export async function createTenant(payload: any) {
  const res = await api.post("/tenants", payload);
  return res.data;
}