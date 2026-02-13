import { api } from "./api";

export async function getPackages() {
  const res = await api.get("/packages");
  return res.data;
}

export async function getPackageById(id: string) {
  const res = await api.get(`/packages/${id}`);
  return res.data;
}

export async function createPackage(payload: any) {
  const res = await api.post("/packages", payload);
  return res.data;
}

export async function updatePackage(
  id: string,
  payload: any
) {
  const res = await api.patch(`/packages/${id}`, payload);
  return res.data;
}

export async function deletePackage(id: string) {
  const res = await api.delete(`/packages/${id}`);
  return res.data;
}

