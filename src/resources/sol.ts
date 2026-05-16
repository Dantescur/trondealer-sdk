import type { TronDealerHttpClient } from "../http";
import type {
  SolAssignRequest,
  SolAddressRequest,
  SolTransactionsRequest,
  SolAssignWalletResponse,
  SolBalanceResponse,
  SolTransactionsResponse,
} from "../types";

export class SolResource {
  constructor(private readonly http: TronDealerHttpClient) {}

  assign(data?: SolAssignRequest) {
    return this.http.post<SolAssignWalletResponse>("/api/v2/sol/wallets/assign", data ?? {});
  }

  balance(data: SolAddressRequest) {
    return this.http.post<SolBalanceResponse>("/api/v2/sol/wallets/balance", data);
  }

  transactions(data?: SolTransactionsRequest) {
    return this.http.post<SolTransactionsResponse>("/api/v2/sol/wallets/transactions", data ?? {});
  }
}
