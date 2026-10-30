import "server-only";
import { headers as requestHeaders } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";
/** Optional private binding; fixed HTTPS in production, explicit loopback in development. */
export async function companionFetch(
  path: string,
  init: RequestInit = {},
  token?: string,
) {
  let binding: { fetch: (r: Request) => Promise<Response> } | undefined;
  try {
    binding = (await getCloudflareContext({ async: true }))
      .env as unknown as typeof binding;
    binding = (binding as any)?.AELIO_PLATFORM;
  } catch {
    /* Next local runtime */
  }
  const local = process.env.AELIO_PLATFORM_LOCAL_ORIGIN;
  let base = "http://aelio-platform.internal";
  if (!binding) {
    if(process.env.NODE_ENV==='production')base='https://aelio.live';
    else{
      if(!local||!['localhost','127.0.0.1'].includes(new URL(local).hostname))throw Error('Configure a loopback AELIO_PLATFORM_LOCAL_ORIGIN for local development.');
      base=local;
    }
  }
  const headers = new Headers(init.headers);
  try {
    const incoming = await requestHeaders();
    const ip = incoming.get("cf-connecting-ip");
    if (ip) headers.set("cf-connecting-ip", ip);
  } catch {
    /* no request context in offline tests */
  }
  headers.set("origin", new URL(base).origin);
  headers.set("x-aelio-product", "pathd");
  if (token) headers.set("authorization", "Bearer " + token);
  const request = new Request(base + "/api/platform" + path, {
    ...init,
    headers,
  });
  return binding ? binding.fetch(request) : fetch(request);
}
