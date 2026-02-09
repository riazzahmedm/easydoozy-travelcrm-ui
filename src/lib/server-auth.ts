import { ServerUser } from "./types";
import { serverFetch } from "./server-api";

export async function getServerUser(): Promise<ServerUser | null> {
  const res = await serverFetch("/auth/me");

  if (!res.ok) return null;
  return res.json();
}
