import { staticApi } from './staticDemo';

if (typeof window !== 'undefined' && window.location.hostname.endsWith('github.io')) {
  const nativeFetch = window.fetch.bind(window);
  window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    if (new URL(url, window.location.origin).pathname.startsWith('/api/')) return staticApi(url, init) as Promise<Response>;
    return nativeFetch(input, init);
  }) as typeof window.fetch;
}
