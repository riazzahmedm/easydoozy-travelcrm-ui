import { api } from "./api";
import { Plan } from "@/types/api";

export async function getPlans() {
  const res = await api.get<Plan[]>("/plans");
  return res.data;
}

export async function getPlanById(id: string) {
  const res = await api.get<Plan>(`/plans/${id}`);
  return res.data;
}

export async function createPlan(
  payload: Pick<Plan, "name" | "code" | "isActive" | "limits">
) {
  const res = await api.post<Plan>("/plans", payload);
  return res.data;
}

export async function updatePlan(
  id: string,
  payload: Pick<Plan, "name" | "isActive" | "limits">
) {
  const res = await api.patch<Plan>(`/plans/${id}`, payload);
  return res.data;
}

export async function togglePlanStatus(
  planId: string,
  isActive: boolean
) {
  const res = await api.patch<Plan>(`/plans/${planId}`, {
    isActive,
  });
  return res.data;
}
