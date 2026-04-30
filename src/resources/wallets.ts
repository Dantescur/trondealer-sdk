import type { RequestOptions } from '../utils/http';
import { trondealerRequest } from '../utils/http';
import type { AssignedWallet, AssignRequest, AddressRequest, Balances, TransactionsRequest, Transaction } from '../types';

export class WalletsResource {
  constructor(private opts: RequestOptions) { }

  assign(data?: AssignRequest) {
    return trondealerRequest<AssignedWallet>('/api/v2/wallets/assign', 'POST', data ?? {}, this.opts);
  }

  balance(data: AddressRequest) {
    return trondealerRequest<Balances>('/api/v2/wallets/balance', 'POST', data, this.opts);
  }

  transactions(data: TransactionsRequest) {
    return trondealerRequest<{ data: Transaction[]; total: number }>(
      '/api/v2/wallets/transactions',
      'POST',
      data,
      this.opts
    );
  }
}
