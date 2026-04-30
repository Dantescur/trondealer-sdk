export class TronDealerError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly response?: unknown
  ) {
    super(message);
    this.name = 'TronDealerError';
  }
}

export interface RequestOptions {
  apiKey?: string;
  baseUrl?: string;
  timeout?: number;
}

export async function trondealerRequest<T>(
  path: string,
  method: string,
  body?: unknown,
  opts: RequestOptions = {}
): Promise<T> {
  const baseUrl = opts.baseUrl || 'https://api.trondealer.com';
  const headers = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(opts.apiKey ? { 'X-API-Key': opts.apiKey } : {}),
  });

  const controller = new AbortController();
  const timeout = opts.timeout ?? 10_000;
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    // Parse JSON with explicit unknown typing for safe narrowing
    const data = (await res.json().catch(() => null)) as unknown;

    if (!res.ok) {
      // Type guard: safely extract error message if present
      let errorMessage = `HTTP ${res.status} ${res.statusText}`;
      if (data && typeof data === 'object' && 'error' in data) {
        const maybeError = (data as { error?: unknown }).error;
        if (typeof maybeError === 'string' && maybeError) {
          errorMessage = maybeError;
        }
      }

      throw new TronDealerError(errorMessage, res.status, undefined, data);
    }

    return data as T;
  } finally {
    clearTimeout(timer);
  }
}
