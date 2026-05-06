export interface TronDealerConfig {
  apiKey?: string;
  baseUrl: string;
  timeout: number;
}

export interface TronDealerOptions {
  apiKey?: string;
  baseUrl?: string;
  timeout?: number;
}

const DEFAULT_BASE_URL = "https://trondealer.com";
const DEFAULT_TIMEOUT = 10_000;

export function normalizeConfig(options: TronDealerOptions = {}): TronDealerConfig {
  return {
    apiKey: options.apiKey,
    baseUrl: options.baseUrl ?? DEFAULT_BASE_URL,
    timeout: options.timeout ?? DEFAULT_TIMEOUT,
  };
}
