import { NextRequest } from "next/server";

const API_ORIGIN = process.env.API_ORIGIN;

function getTargetUrl(
  req: NextRequest,
  params: { path: string[] }
) {
  if (!API_ORIGIN) {
    throw new Error("Missing API_ORIGIN env var");
  }

  const path = params.path.join("/");
  const url = new URL(`${API_ORIGIN.replace(/\/$/, "")}/${path}`);
  url.search = req.nextUrl.search;
  return url;
}

async function proxyRequest(
  req: NextRequest,
  params: { path: string[] }
) {
  const targetUrl = getTargetUrl(req, params);
  const headers = new Headers(req.headers);

  headers.delete("host");
  headers.delete("content-length");

  const method = req.method.toUpperCase();
  const hasBody = method !== "GET" && method !== "HEAD";
  const body = hasBody ? await req.arrayBuffer() : undefined;

  const upstream = await fetch(targetUrl, {
    method,
    headers,
    body,
    redirect: "manual",
    cache: "no-store",
  });

  const responseHeaders = new Headers();
  const contentType = upstream.headers.get("content-type");
  const setCookie = upstream.headers.get("set-cookie");

  if (contentType) responseHeaders.set("content-type", contentType);
  if (setCookie) responseHeaders.set("set-cookie", setCookie);

  return new Response(await upstream.arrayBuffer(), {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(req, await context.params);
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(req, await context.params);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(req, await context.params);
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(req, await context.params);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(req, await context.params);
}

export async function OPTIONS(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(req, await context.params);
}
