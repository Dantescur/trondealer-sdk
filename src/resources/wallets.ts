import type { TronDealerHttpClient } from '../http';
import type { AssignedWallet, AssignRequest, AddressRequest, Balances, TransactionsRequest, Transaction } from '../types';

export class WalletsResource {
  constructor(private readonly http: TronDealerHttpClient) {}

  assign(data?: AssignRequest) {
    return this.http.post<AssignedWallet>('/api/v2/wallets/assign', data ?? {});
  }

  balance(data: AddressRequest) {
    return this.http.post<Balances>('/api/v2/wallets/balance', data);
  }

  transactions(data: TransactionsRequest) {
    return this.http.post<{ data: Transaction[]; total: number }>(
      '/api/v2/wallets/transactions',
      data,
    );
  }
}
