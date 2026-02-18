import { serverFetch } from "./server-api";


export async function getServerLeads() {
  const res = await serverFetch("/leads");

  if (!res.ok) {
    return [];
  }

  return res.json();
}


export async function getServerLeadById(id: string) {
  const res = await serverFetch(`/leads/${id}`);

  if (!res.ok) return null;
  return res.json();
}
