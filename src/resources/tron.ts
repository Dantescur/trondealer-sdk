import type { TronDealerHttpClient } from "../http";
import type {
  TronAssignRequest,
  TronAddressRequest,
  TronTransactionsRequest,
  TronAssignWalletResponse,
  TronBalanceResponse,
  TronTransactionsResponse,
} from "../types";

export class TronResource {
  constructor(private readonly http: TronDealerHttpClient) {}

  assign(data?: TronAssignRequest) {
    return this.http.post<TronAssignWalletResponse>("/api/v2/tron/wallets/assign", data ?? {});
  }

  balance(data: TronAddressRequest) {
    return this.http.post<TronBalanceResponse>("/api/v2/tron/wallets/balance", data);
  }

  transactions(data?: TronTransactionsRequest) {
    return this.http.post<TronTransactionsResponse>(
      "/api/v2/tron/wallets/transactions",
      data ?? {},
    );
  }
}
