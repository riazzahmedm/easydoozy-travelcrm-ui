import { api } from "./api";

export async function assignSubscription(payload: {
  tenantId: string;
  planId: string;
}) {
  const res = await api.post("/subscriptions/assign", payload);
  return res.data;
}
