import { NSW_API_ENDPOINTS } from '@/constants/apiEndpoints';

/**
 * Fetch a URL via the CORS proxy.
 * The proxy expects a POST with JSON body: { url, method, headers }
 */
export async function proxyFetch<T = unknown>(
  url: string,
  options: { signal?: AbortSignal } = {}
): Promise<T> {
  const response = await fetch(NSW_API_ENDPOINTS.PROXY, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
    },
    body: JSON.stringify({
      url,
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
      },
    }),
    signal: options.signal,
  });

  if (!response.ok) {
    throw new Error(`Proxy request failed: ${response.statusText}`);
  }

  return (await response.json()) as T;
}
