import { api } from "./api";

export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "WON" | "LOST";

export type LeadPayload = {
  name: string;
  phone: string;
  travelDate: string;
  budget: number;
  assignedToId: string;
  email?: string;
  travelers?: number;
  source?: string;
  notes?: string;
  status?: LeadStatus;
  destinationId?: string;
  packageId?: string;
};

export async function getLeads() {
  const res = await api.get("/leads");
  return res.data;
}

export async function searchLeadsByPhone(phone: string) {
  const res = await api.get("/leads/search/phone", {
    params: { phone },
  });
  return res.data;
}

export async function createLead(payload: LeadPayload) {
  const res = await api.post("/leads", payload);
  return res.data;
}

export async function updateLead(id: string, payload: LeadPayload) {
  const res = await api.patch(`/leads/${id}`, payload);
  return res.data;
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  const res = await api.patch(`/leads/${id}/status`, { status });
  return res.data;
}

export async function convertLeadToBooking(
  leadId: string,
  payload: {
    packageId?: string;
    destinationId?: string;
    totalAmount: number;
    paidAmount: number;
  }
) {
  const res = await api.post(
    `/leads/${leadId}/convert`,
    payload
  );

  return res.data;
}

export async function getLeadAuditLogs(leadId: string) {
  const res = await api.get(`/leads/${leadId}/logs`);
  return res.data;
}
