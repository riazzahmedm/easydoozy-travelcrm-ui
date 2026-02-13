import { api } from "./api";

export interface Agent {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateAgentPayload {
  name: string;
  email: string;
  password: string;
}

export interface UpdateAgentStatusPayload {
  isActive: boolean;
}

export async function getAgents(): Promise<Agent[]> {
  const res = await api.get("/users/agents");
  return res.data;
}

export async function createAgent(
  payload: CreateAgentPayload
): Promise<Agent> {
  const res = await api.post("/users/agents", payload);
  return res.data;
}

export async function updateAgentStatus(
  id: string,
  isActive: boolean
): Promise<Agent> {
  const res = await api.patch(
    `/users/agents/${id}/status`,
    { isActive }
  );
  return res.data;
}

// export async function deleteAgent(id: string) {
//   const res = await api.delete(`/users/${id}`);
//   return res.data;
// }
