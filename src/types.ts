export type Network = 'bsc' | 'eth' | 'pol' | 'arbitrum' | 'base';
export type Asset = 'USDT' | 'USDC';
export type TransactionStatus = 'detected' | 'confirmed' | 'notified' | 'swept';
export type WalletStatus = 'active' | 'inactive';
export type PayoutMethod = 'wallet' | 'qvapay' | 'zelle';
export type WebhookEvent = 'transaction.incoming' | 'transaction.confirmed';

export interface RegisterRequest {
  name: string;
  webhook_url?: string | null;
  webhook_secret?: string | null;
  min_confirmations?: number | null;
  payout_method?: PayoutMethod | null;
  sweep_wallet?: string | null;
  qvapay_account?: string | null;
  zelle_contact?: string | null;
}

export interface ClientFull extends RegisterRequest {
  id: string;
  api_key: string;
  is_active: boolean;
  created_at: string;
}

export interface ClientConfig {
  id: string;
  name: string;
  webhook_url?: string | null;
  webhook_secret_masked?: string | null;
  has_webhook_secret: boolean;
  min_confirmations?: number | null;
  sweep_wallet?: string | null;
  payout_method?: PayoutMethod | null;
  qvapay_account?: string | null;
  zelle_contact?: string | null;
  created_at: string;
}

export interface UpdateConfigRequest {
  webhook_url?: string | null;
  webhook_secret?: string | null;
  payout_method?: PayoutMethod | null;
  sweep_wallet?: string | null;
  qvapay_account?: string | null;
  zelle_contact?: string | null;
  min_confirmations?: number;
}

export interface AssignRequest {
  label?: string;
}

export interface AssignedWallet {
  id: string;
  address: string;
  label?: string | null;
  status: WalletStatus;
  created_at: string;
}

export interface AddressRequest {
  address: string;
}

export interface Balances {
  NativeToken: string;
  USDT: string;
  USDC: string;
}

export interface TransactionsRequest {
  address: string;
  limit?: number;
  offset?: number;
  status?: TransactionStatus;
}

export interface Transaction {
  tx_hash: string;
  log_index: number;
  block_number: number;
  from_address: string;
  to_address: string;
  asset: Asset;
  amount: string;
  confirmations: number;
  status: TransactionStatus;
  detected_at: string;
  created_at: string;
}

export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  data: WebhookTransactionData;
}

export interface WebhookTransactionData {
  tx_hash: string;
  block_number: number;
  from_address: string;
  to_address: string;
  asset: Asset;
  amount: string;
  confirmations: number;
  wallet_label?: string | null;
  network: Network;
}

export interface ErrorResponse {
  error: string;
}
