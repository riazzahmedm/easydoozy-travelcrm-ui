import { api } from "./api";

export async function getTenantDashboard() {
  const res = await api.get("/tenant/dashboard");
  return res.data;
}
