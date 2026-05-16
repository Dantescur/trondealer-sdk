import type { TronDealerHttpClient } from "../http";
import type { NetworksResponse } from "../types";

export class NetworksResource {
  constructor(private readonly http: TronDealerHttpClient) {}

  list() {
    return this.http.get<NetworksResponse>("/api/v2/networks");
  }
}
