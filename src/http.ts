export class TronDealerError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly response?: unknown,
  ) {
    super(message);
    this.name = 'TronDealerError';
  }
}

export interface Transport {
  request(path: string, method: string, body?: unknown, headers?: HeadersInit): Promise<unknown>;
}

export class FetchTransport implements Transport {
  constructor(private timeout: number) {}

  async request(path: string, method: string, body?: unknown, headers?: HeadersInit): Promise<unknown> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const res = await fetch(path, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      const data = (await res.json().catch(() => null)) as unknown;

      if (!res.ok) {
        let errorMessage = `HTTP ${res.status} ${res.statusText}`;
        if (data && typeof data === 'object' && 'error' in data) {
          const maybeError = (data as { error?: unknown }).error;
          if (typeof maybeError === 'string' && maybeError) {
            errorMessage = maybeError;
          }
        }
        throw new TronDealerError(errorMessage, res.status, undefined, data);
      }

      return data;
    } finally {
      clearTimeout(timer);
    }
  }
}

export class TronDealerHttpClient {
  constructor(
    private readonly transport: Transport,
    private readonly baseUrl: string,
    private readonly apiKey?: string,
  ) {}

  async get<T>(path: string): Promise<T> {
    return this.request<T>(path, 'GET');
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, 'POST', body);
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, 'PATCH', body);
  }

  private async request<T>(path: string, method: string, body?: unknown): Promise<T> {
    const headers = new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(this.apiKey ? { 'X-API-Key': this.apiKey } : {}),
    });

    const data = await this.transport.request(
      `${this.baseUrl}${path}`,
      method,
      body,
      headers,
    );

    return data as T;
  }
}
