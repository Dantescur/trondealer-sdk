export type Network = "bsc" | "eth" | "pol" | "arbitrum" | "base" | "avalanche" | "optimism";
export type WebhookNetwork = "bsc" | "eth" | "pol";
export type Asset = "USDT" | "USDC";
export type TransactionStatus = "detected" | "confirmed" | "notified" | "swept";
export type WalletStatus = "active" | "inactive";
export type WebhookEvent = "transaction.incoming" | "transaction.confirmed";

// --- Payout method discriminated unions ---

interface BaseRequest {
  name: string;
  webhook_url?: string | null;
  webhook_secret?: string | null;
  min_confirmations?: number | null;
}

interface WalletPayout {
  payout_method: "wallet";
  sweep_wallet_evm?: string | null;
  sweep_wallet_tron?: string | null;
  /**
   * @deprecated alias of sweep_wallet_evm kept for backwards compatibility.
   * New integrations should send sweep_wallet_evm and/or sweep_wallet_tron explicitly.
   */
  sweep_wallet?: string | null;
  qvapay_account?: never;
  zelle_contact?: never;
}

interface QvapayPayout {
  payout_method: "qvapay";
  qvapay_account: string;
  sweep_wallet_evm?: never;
  sweep_wallet_tron?: never;
  sweep_wallet?: never;
  zelle_contact?: never;
}

interface ZellePayout {
  payout_method: "zelle";
  zelle_contact: string;
  qvapay_account?: never;
  sweep_wallet_evm?: never;
  sweep_wallet_tron?: never;
  sweep_wallet?: never;
}

interface NoPayout {
  payout_method?: null;
  sweep_wallet_evm?: never;
  sweep_wallet_tron?: never;
  sweep_wallet?: never;
  qvapay_account?: never;
  zelle_contact?: never;
}

export type RegisterRequest = BaseRequest & (WalletPayout | QvapayPayout | ZellePayout | NoPayout);

// --- Update config request (partial updates, all fields optional) ---

export interface UpdateConfigRequest {
  webhook_url?: string | null;
  webhook_secret?: string | null;
  payout_method?: PayoutMethod | null;
  /**
   * @deprecated alias of sweep_wallet_evm kept for backwards compatibility.
   * New integrations should send sweep_wallet_evm and/or sweep_wallet_tron explicitly.
   */
  sweep_wallet?: string | null;
  sweep_wallet_evm?: string | null;
  sweep_wallet_tron?: string | null;
  qvapay_account?: string | null;
  zelle_contact?: string | null;
  min_confirmations?: number;
}

// --- Payout method type (for response shapes) ---

export type PayoutMethod = "wallet" | "qvapay" | "zelle";

// --- Client response types ---

export interface ClientFull {
  id: string;
  name: string;
  api_key: string;
  webhook_url?: string | null;
  min_confirmations?: number | null;
  sweep_wallet_evm?: string | null;
  sweep_wallet_tron?: string | null;
  payout_method?: PayoutMethod | null;
  qvapay_account?: string | null;
  zelle_contact?: string | null;
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
  sweep_wallet_evm?: string | null;
  sweep_wallet_tron?: string | null;
  payout_method?: PayoutMethod | null;
  qvapay_account?: string | null;
  zelle_contact?: string | null;
  created_at: string;
}

// --- Wallet & Transaction types ---

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

export interface WalletInfo {
  address: string;
  label?: string | null;
  status: WalletStatus;
}

export interface Balances {
  bsc: { BNB: number; USDT: number; USDC: number };
  eth: { ETH: number; USDT: number; USDC: number };
  pol: { POL: number; USDT: number; USDC: number };
  base: { ETH: number; USDT: number; USDC: number };
  arb: { ETH: number; USDT: number; USDC: number };
  opt: { ETH: number; USDT: number; USDC: number };
  avax: { AVAX: number; USDT: number; USDC: number };
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

// --- Response envelope types ---

export interface ApiResponse<T> {
  success: boolean;
  [key: string]: unknown;
}

export interface RegisterResponse {
  success: boolean;
  client: ClientFull;
}

export interface ClientConfigResponse {
  success: boolean;
  client: ClientConfig;
}

export interface AssignWalletResponse {
  success: boolean;
  wallet: AssignedWallet;
}

export interface BalanceResponse {
  success: boolean;
  wallet: WalletInfo;
  balances: Balances;
}

export interface TransactionsResponse {
  success: boolean;
  wallet: WalletInfo;
  total: number;
  limit: number;
  offset: number;
  transactions: Transaction[];
}

// --- Webhook types ---

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
  network: WebhookNetwork;
}

// --- Error types ---

export interface ErrorResponse {
  error: string;
}
