import type { TronDealerHttpClient } from "../http";
import type {
  SuiAssignRequest,
  SuiAddressRequest,
  SuiTransactionsRequest,
  SuiAssignWalletResponse,
  SuiBalanceResponse,
  SuiTransactionsResponse,
} from "../types";

export class SuiResource {
  constructor(private readonly http: TronDealerHttpClient) {}

  assign(data?: SuiAssignRequest) {
    return this.http.post<SuiAssignWalletResponse>("/api/v2/sui/wallets/assign", data ?? {});
  }

  balance(data: SuiAddressRequest) {
    return this.http.post<SuiBalanceResponse>("/api/v2/sui/wallets/balance", data);
  }

  transactions(data?: SuiTransactionsRequest) {
    return this.http.post<SuiTransactionsResponse>("/api/v2/sui/wallets/transactions", data ?? {});
  }
}
