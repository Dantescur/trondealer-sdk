export type Network = "bsc" | "eth" | "pol" | "arb" | "base" | "opt" | "avax";
export type Asset = "USDT" | "USDC";
export type TransactionStatus = "detected" | "confirmed" | "notified" | "swept";
export type WalletStatus = "active" | "inactive";
export type WebhookEvent = "transaction.incoming" | "transaction.confirmed" | "transaction.swept";
export type PayoutMethod = "wallet" | "qvapay" | "zelle";

// --- Register / Client types (discriminated union for payout) ---

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

export interface UpdateConfigRequest {
  webhook_url?: string | null;
  webhook_secret?: string | null;
  payout_method?: PayoutMethod | null;
  sweep_wallet?: string | null;
  sweep_wallet_evm?: string | null;
  sweep_wallet_tron?: string | null;
  qvapay_account?: string | null;
  zelle_contact?: string | null;
  min_confirmations?: number;
}

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

// --- EVM Wallet types ---

export interface AssignRequest {
  label?: string;
  single_use?: boolean;
}

export interface AssignedWallet {
  id: string;
  address: string;
  label?: string | null;
  status: WalletStatus;
  single_use: boolean;
  created_at: string;
}

export interface AddressRequest {
  address: string;
}

export interface WalletInfo {
  address: string;
  label?: string | null;
  status?: WalletStatus;
}

export interface EvmBalances {
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

// --- TRON Wallet types ---

export interface TronAssignRequest {
  label?: string;
  single_use?: boolean;
}

export interface AssignedTronWallet {
  id: string;
  address: string;
  label?: string | null;
  status: WalletStatus;
  activated: boolean;
  single_use: boolean;
  created_at: string;
}

export interface TronAddressRequest {
  address: string;
}

export interface TronBalanceEntry {
  raw: string;
  formatted: string;
}

export interface TronBalances {
  TRX: TronBalanceEntry;
  USDT: TronBalanceEntry;
}

export interface TronTransactionsRequest {
  address?: string;
  limit?: number;
  offset?: number;
  status?: TransactionStatus;
}

export interface TronTransaction {
  id: string;
  tx_id: string;
  event_index: number;
  block_number: number;
  block_timestamp: number;
  from_address: string;
  to_address: string;
  asset: "USDT";
  amount: string;
  amount_raw: string;
  confirmations: number;
  status: TransactionStatus;
  webhook_sent: boolean;
  detected_at: string;
  updated_at: string;
  wallet_id: string;
}

// --- Solana Wallet types ---

export interface SolAssignRequest {
  label?: string;
  single_use?: boolean;
}

export interface AssignedSolWallet {
  id: string;
  address: string;
  label?: string | null;
  status: WalletStatus;
  single_use: boolean;
  created_at: string;
}

export interface SolAddressRequest {
  address: string;
}

export interface SolBalanceEntry {
  raw: string;
  formatted: string;
}

export interface SolBalances {
  SOL: SolBalanceEntry;
  USDT: SolBalanceEntry;
  USDC: SolBalanceEntry;
}

export interface SolTransactionsRequest {
  address?: string;
  limit?: number;
  offset?: number;
  status?: TransactionStatus;
}

export interface SolTransaction {
  id: string;
  tx_signature: string;
  instruction_index: number;
  slot: number;
  block_time?: string | null;
  from_address?: string | null;
  to_address: string;
  asset: Asset;
  amount: string;
  amount_raw: string;
  confirmations: number;
  status: TransactionStatus;
  webhook_sent: boolean;
  created_at: string;
  updated_at: string;
  wallet_id: string;
}

// --- Response envelope types ---

// EVM
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

export interface EvmBalanceResponse {
  success: boolean;
  wallet: WalletInfo;
  balances: EvmBalances;
}

export interface EvmTransactionsResponse {
  success: boolean;
  wallet: { address: string; label?: string | null };
  total: number;
  limit: number;
  offset: number;
  transactions: Transaction[];
}

// TRON
export interface TronAssignWalletResponse {
  success: boolean;
  wallet: AssignedTronWallet;
}

export interface TronBalanceResponse {
  success: boolean;
  address: string;
  label?: string | null;
  activated: boolean;
  balances: TronBalances;
}

export interface TronTransactionsResponse {
  success: boolean;
  transactions: TronTransaction[];
}

// SOL
export interface SolAssignWalletResponse {
  success: boolean;
  wallet: AssignedSolWallet;
}

export interface SolBalanceResponse {
  success: boolean;
  address: string;
  label?: string | null;
  balances: SolBalances;
}

export interface SolTransactionsResponse {
  success: boolean;
  transactions: SolTransaction[];
}

// Networks
export interface NetworkInfo {
  key: string;
  family: "evm" | "tron" | "sol";
  label: string;
  network_param?: string | null;
  native_token?: string | null;
  default_min_confirmations: number;
  assets: NetworkAsset[];
}

export interface NetworkAsset {
  symbol: string;
  decimals: number;
  contract?: string | null;
}

export interface NetworksResponse {
  success: boolean;
  networks: NetworkInfo[];
}

// --- Webhook types ---

export type WebhookNetwork = Network | "tron" | "solana";

export interface WebhookPayload {
  event: "transaction.incoming" | "transaction.confirmed";
  timestamp: string;
  data: WebhookTransactionData;
}

export interface WebhookSweptPayload {
  event: "transaction.swept";
  timestamp: string;
  data: WebhookSweptData;
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

export interface WebhookSweptData {
  sweep_tx_hash?: string | null;
  fee_tx_hash?: string | null;
  funding_tx_hash?: string | null;
  source_tx_hashes: string[];
  asset: Asset;
  amount: string;
  gross_amount: string;
  fee_amount?: string | null;
  destination: string;
  wallet_address: string;
  wallet_label?: string | null;
  network: WebhookNetwork;
}

// --- Error types ---

export interface ErrorResponse {
  error: string;
}
