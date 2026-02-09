import { api } from "./api";

export async function getPlans() {
  const res = await api.get("/plans");
  return res.data;
}

export async function getPlanById(id: string) {
  const res = await api.get(`/plans/${id}`);
  return res.data;
}

export async function createPlan(payload: any) {
  const res = await api.post("/plans", payload);
  return res.data;
}

export async function updatePlan(id: string, payload: any) {
  const res = await api.patch(`/plans/${id}`, payload);
  return res.data;
}

export async function togglePlanStatus(
  planId: string,
  isActive: boolean
) {
  const res = await api.patch(`/plans/${planId}/status`, {
    isActive,
  });
  return res.data;
}
