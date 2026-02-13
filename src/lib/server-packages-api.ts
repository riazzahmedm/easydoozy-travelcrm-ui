import { serverFetch } from "./server-api";

export async function getServerPackageById(id: string) {
  const res = await serverFetch(`/packages/${id}`);

  if (!res.ok) {
    return null;
  }

  return res.json();
}
