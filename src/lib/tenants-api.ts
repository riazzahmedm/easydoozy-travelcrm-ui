import { api } from "./api";
import {
  CreateTenantPayload,
  CreateTenantResponse,
  TenantDetails,
} from "@/types/api";

export async function getTenants() {
  const res = await api.get<TenantDetails[]>("/tenants");
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

export async function createTenant(payload: CreateTenantPayload) {
  const res = await api.post<CreateTenantResponse>(
    "/tenants",
    payload
  );
  return res.data;
}

export async function updateTenant(
  id: string,
  payload: {
    adminName?: string;
    adminEmail?: string;
    logo?: string;
    color?: string;
  }
) {
  const res = await api.patch<TenantDetails>(`/tenants/${id}`, payload);
  return res.data;
}
