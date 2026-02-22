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

async function resolveApiBaseUrl() {
  if (apiBaseUrl.startsWith("http")) {
    return apiBaseUrl;
  }

  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") ?? "http";

  if (!host) {
    throw new Error("Unable to resolve request host for server fetch");
  }

  return `${protocol}://${host}${apiBaseUrl}`;
}

export async function serverFetch(
  path: string,
  init: RequestInit = {}
) {
  const baseUrl = await resolveApiBaseUrl();
  const cookieHeader = await getAuthCookieHeader();
  const headers = new Headers(init.headers);

  if (cookieHeader) {
    headers.set("cookie", cookieHeader);
  }

  return fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}
