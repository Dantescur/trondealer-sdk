import type { TronDealerHttpClient } from "../http";
import type {
  SwapPairsResponse,
  SwapQuoteRequest,
  SwapQuoteResponse,
  SwapCreateRequest,
  SwapCreateResponse,
  SwapGetResponse,
  SwapUnlockRequest,
  SwapUnlockResponse,
} from "../types";

export class SwapResource {
  constructor(private readonly http: TronDealerHttpClient) {}

  pairs() {
    return this.http.get<SwapPairsResponse>("/api/v2/swap/pairs");
  }

  quote(data: SwapQuoteRequest) {
    return this.http.post<SwapQuoteResponse>("/api/v2/swap/quote", data);
  }

  create(data: SwapCreateRequest) {
    return this.http.post<SwapCreateResponse>("/api/v2/swap/create", data);
  }

  get(id: string) {
    return this.http.get<SwapGetResponse>(`/api/v2/swap/${id}`);
  }

  stream(id: string): EventSource {
    return new EventSource(`${this.http.baseUrl}/api/v2/swap/${id}/stream`);
  }

  unlock(id: string, data: SwapUnlockRequest) {
    return this.http.post<SwapUnlockResponse>(`/api/v2/swap/${id}/unlock`, data);
  }
}
