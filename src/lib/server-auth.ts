import { cookies } from "next/headers";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export async function getServerUser() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return null;

  const res = await fetch(`${apiBaseUrl}/auth/me`, {
    headers: {
      cookie: `access_token=${accessToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}
