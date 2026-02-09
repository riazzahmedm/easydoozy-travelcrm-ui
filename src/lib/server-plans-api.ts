import { serverFetch } from "./server-api";

export async function getServerPlanById(id: string) {
  const res = await serverFetch(`/plans/${id}`);

  if (!res.ok) {
    return { plan: null, status: res.status };
  }

  return { plan: await res.json(), status: 200 };
}
