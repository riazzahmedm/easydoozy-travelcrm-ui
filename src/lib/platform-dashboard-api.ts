import { api } from "./api";

export async function getPlatformDashboard() {
  const res = await api.get("/platform/dashboard");
  return res.data;
}