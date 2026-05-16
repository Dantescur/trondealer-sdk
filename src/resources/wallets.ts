import type { TronDealerHttpClient } from "../http";
import type {
  AssignRequest,
  AddressRequest,
  TransactionsRequest,
  AssignWalletResponse,
  EvmBalanceResponse,
  EvmTransactionsResponse,
} from "../types";

export class WalletsResource {
  constructor(private readonly http: TronDealerHttpClient) {}

  assign(data?: AssignRequest) {
    return this.http.post<AssignWalletResponse>("/api/v2/wallets/assign", data ?? {});
  }

  balance(data: AddressRequest) {
    return this.http.post<EvmBalanceResponse>("/api/v2/wallets/balance", data);
  }

  transactions(data: TransactionsRequest) {
    return this.http.post<EvmTransactionsResponse>("/api/v2/wallets/transactions", data);
  }
}
