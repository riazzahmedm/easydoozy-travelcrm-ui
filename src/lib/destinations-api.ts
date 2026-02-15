import { api } from "./api";

export async function getDestinations() {
  const res = await api.get("/destinations");
  return res.data;
}

export async function createDestination(payload: any) {
  const res = await api.post("/destinations", payload);
  return res.data;
}

export async function getPackagesByDestination(destinationId: string) {
  const res = await api.get(`/packages/by-destination/${destinationId}`);
  return res.data;
}

export async function updateDestination(
  id: string,
  payload: any
) {
  const res = await api.patch(
    `/destinations/${id}`,
    payload
  );
  return res.data;
}

export async function deleteDestination(id: string) {
  const res = await api.delete(
    `/destinations/${id}`
  );
  return res.data;
}
