import { serverFetch } from "./server-api";

export async function getServerDestinationById(
  id: string
) {
  const res = await serverFetch(
    `/destinations/${id}`
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}
