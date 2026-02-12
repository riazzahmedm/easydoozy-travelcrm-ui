import { api } from "./api";

export async function getTags() {
  const res = await api.get("/tags");
  return res.data;
}

export async function createTag(payload: any) {
  const res = await api.post("/tags", payload);
  return res.data;
}

export async function updateTag(
  id: string,
  payload: any
) {
  const res = await api.patch(`/tags/${id}`, payload);
  return res.data;
}

export async function deleteTag(id: string) {
  const res = await api.delete(`/tags/${id}`);
  return res.data;
}
