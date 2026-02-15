import { api } from "./api";

export async function getLeads() {
  const res = await api.get("/leads");
  return res.data;
}

export async function createLead(payload: any) {
  const res = await api.post("/leads", payload);
  return res.data;
}

export async function updateLead(id: string, payload: any) {
  const res = await api.post(`/leads/${id}`, payload);
  return res.data;
}

export async function updateLeadStatus(id: string, status: string) {
  const res = await api.patch(`/leads/${id}`, { status });
  return res.data;
}