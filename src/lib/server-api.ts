"use server";

import { cookies, headers } from "next/headers";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

async function getAuthCookieHeader() {
  const headerStore = await headers();
  const directCookie = headerStore.get("cookie");
  if (directCookie) return directCookie;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (!accessToken) return "";
  return `access_token=${accessToken}`;
}

export async function serverFetch(
  path: string,
  init: RequestInit = {}
) {
  const cookieHeader = await getAuthCookieHeader();
  const headers = new Headers(init.headers);

  if (cookieHeader) {
    headers.set("cookie", cookieHeader);
  }

  return fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}
