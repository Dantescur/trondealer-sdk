# Tron Dealer V2 SDK

> **Disclaimer:** This SDK is an independent, community-maintained project and is not officially affiliated with, endorsed by, or coordinated with the Tron Dealer team. The Tron Dealer API is under active development — this SDK may lag behind the latest API changes. Always refer to the [official API documentation](https://trondealer.com/en/docs) for the most up-to-date specification.

TypeScript SDK for the [Tron Dealer V2 API](https://trondealer.com). Provides type-safe access to wallet management across EVM networks (BSC, Ethereum, Polygon, Arbitrum, Base, Optimism, Avalanche), TRON (USDT TRC20), Solana (USDT-SPL, USDC-SPL), and SUI (USDC native).

## Installation

```bash
npm install @areitosa/trondealer-sdk
pnpm add @areitosa/trondealer-sdk
yarn add @areitosa/trondealer-sdk
```

## Requirements

- Node.js 18 or higher
- TypeScript 5.0 or higher (for type checking)
- A Tron Dealer API key (obtained after client registration)

## Quick Start

### Initialize the Client

```typescript
import { TronDealer } from "@areitosa/trondealer-sdk";

// Public endpoints (no API key required)
const publicClient = new TronDealer();

// Authenticated requests (after registration)
const client = new TronDealer({
  apiKey: "td_your_api_key_here",
  baseUrl: "https://trondealer.com",
  timeout: 15000, // default: 10000ms
});
```

### Register a New Client

```typescript
const registered = await publicClient.clients.register({
  name: "My Business",
  webhook_url: "https://myapp.com/webhooks/trondealer",
  webhook_secret: "your_webhook_secret",
  min_confirmations: 12,
  payout_method: "wallet",
  sweep_wallet_evm: "0xYourEVMAddressHere",
  sweep_wallet_tron: "TCsHYKC27np7cGAxJEq55DnsGysejpFF11",
});

console.log("API Key:", registered.client.api_key);
```

### List Supported Networks

```typescript
const networks = await publicClient.networks.list();
console.log(networks.networks.map((n) => n.label));
// ["BSC", "Ethereum", "Polygon", "Arbitrum", "Base", "Optimism", "Avalanche", "TRON", "Solana", "SUI"]
```

### EVM Wallets

```typescript
// Assign a wallet
const evmWallet = await client.wallets.assign({
  label: "user-12345",
  single_use: true, // auto-deactivate after first sweep
});
console.log("Address:", evmWallet.wallet.address);
console.log("Single-use:", evmWallet.wallet.single_use);

// Check balance
const balance = await client.wallets.balance({
  address: evmWallet.wallet.address,
});
console.log("Native:", balance.balances.NativeToken);
console.log("USDT:", balance.balances.USDT);
console.log("USDC:", balance.balances.USDC);

// Transaction history
const txs = await client.wallets.transactions({
  address: evmWallet.wallet.address,
  limit: 25,
  offset: 0,
  status: "confirmed",
});
console.log(`Found ${txs.total} transactions`);
```

### TRON Wallets

```typescript
// Assign a TRON wallet
const tronWallet = await client.tron.assign({ label: "user-12345" });
console.log("Address:", tronWallet.wallet.address);
console.log("Activated:", tronWallet.wallet.activated);

// Check TRX/USDT balances
const tronBalance = await client.tron.balance({
  address: tronWallet.wallet.address,
});
console.log("TRX:", tronBalance.balances.TRX.formatted);
console.log("USDT:", tronBalance.balances.USDT.formatted);
console.log("Activated:", tronBalance.activated);

// Transaction history (address optional — omit for all client wallets)
const tronTxs = await client.tron.transactions({
  address: tronWallet.wallet.address,
  limit: 20,
});
```

### Solana Wallets

```typescript
// Assign a Solana wallet
const solWallet = await client.sol.assign({ label: "user-12345" });

// Check SOL/USDT/USDC balances
const solBalance = await client.sol.balance({
  address: solWallet.wallet.address,
});
console.log("SOL:", solBalance.balances.SOL.formatted);
console.log("USDT:", solBalance.balances.USDT.formatted);
console.log("USDC:", solBalance.balances.USDC.formatted);

// Transaction history
const solTxs = await client.sol.transactions({
  address: solWallet.wallet.address,
  limit: 20,
});
```

### Manage Client Configuration

```typescript
const configResponse = await client.clients.me();
console.log("Webhook configured:", configResponse.client.has_webhook_secret);

const updatedResponse = await client.clients.update({
  webhook_url: "https://new-endpoint.com/webhook",
  min_confirmations: 20,
});
```

### SUI Wallets

```typescript
// Assign a SUI wallet
const suiWallet = await client.sui.assign({ label: "user-12345" });

// Check SUI/USDC balances
const suiBalance = await client.sui.balance({
  address: suiWallet.wallet.address,
});
console.log("SUI:", suiBalance.balances.SUI.formatted);
console.log("USDC:", suiBalance.balances.USDC.formatted);

// Transaction history
const suiTxs = await client.sui.transactions({
  address: suiWallet.wallet.address,
  limit: 20,
});
```

## Cross-Chain Swap

Anonymous cross-chain stablecoin swap (`/api/v2/swap/*`). No authentication — per-IP rate limits only.

```typescript
// List enabled pairs
const pairs = await client.swap.pairs();

// Quote a swap
const quote = await client.swap.quote({
  asset_in: "USDT",
  chain_in: "bsc",
  asset_out: "USDC",
  chain_out: "pol",
  amount_in: 100,
});

// Create a swap from a quote
const { swap } = await client.swap.create({
  quote_id: quote.quote.id,
  payout_address: "0xYourPayoutAddress",
});

console.log("Deposit to:", swap.deposit_address);
```

### Streaming Swap Status (SSE)

The SDK provides `swap.stream(id)` which returns an `EventSource` connected to the SSE endpoint. Use it for real-time updates:

```typescript
const source = client.swap.stream(swapId);
source.addEventListener("snapshot", (event) => {
  const data = JSON.parse(event.data);
  console.log("Swap state:", data);
});
source.addEventListener("terminal", () => {
  console.log("Swap reached terminal state");
  source.close();
});
```

### Polling Swap Status

Use `swap.get(id)` for reliable polling fallback when SSE is unavailable:

```typescript
let s = (await client.swap.get(swapId)).swap;
while (
  s.status === "waiting_deposit" ||
  s.status === "deposit_detected" ||
  s.status === "deposit_confirmed"
) {
  await new Promise((r) => setTimeout(r, 3000));
  s = (await client.swap.get(swapId)).swap;
}
```

If the user loses their cookie, recover with the deposit tx hash or payout address:

```typescript
await client.swap.unlock(swapId, { tx_hash: "0x..." });
```

### Vue 3 Composable

```typescript
// useSwapStatus.ts
import { ref, onMounted, onUnmounted } from "vue";
import { TronDealer } from "@areitosa/trondealer-sdk";
import type { SwapStatus } from "@areitosa/trondealer-sdk";

const td = new TronDealer();

export function useSwapStatus(swapId: string) {
  const status = ref<SwapStatus>("waiting_deposit");
  const loading = ref(true);
  const error = ref<string | null>(null);
  let timer: ReturnType<typeof setInterval>;

  const terminal = new Set<SwapStatus>([
    "completed",
    "expired",
    "failed",
    "refund_required",
    "refunded",
  ]);

  async function poll() {
    try {
      const res = await td.swap.get(swapId);
      status.value = res.swap.status;
      loading.value = false;
      if (terminal.has(res.swap.status)) clearInterval(timer);
    } catch (e) {
      error.value = (e as Error).message;
      clearInterval(timer);
    }
  }

  onMounted(async () => {
    await poll();
    timer = setInterval(poll, 3000);
  });
  onUnmounted(() => clearInterval(timer));

  return { status, loading, error };
}
```

```vue
<script setup lang="ts">
import { useSwapStatus } from "./useSwapStatus";
const props = defineProps<{ swapId: string }>();
const { status, loading, error } = useSwapStatus(props.swapId);
</script>

<template>
  <span v-if="loading">Checking deposit...</span>
  <span v-else-if="error" class="error">{{ error }}</span>
  <span v-else
    >Status: <strong>{{ status }}</strong></span
  >
</template>
```

## Webhook Verification

Tron Dealer sends webhook notifications to your configured URL. Always verify the `X-Signature-256` header to authenticate the request.

```typescript
import { verifyWebhookSignature } from "@areitosa/trondealer-sdk";
import express from "express";

const app = express();

app.post("/webhooks/trondealer", express.raw({ type: "application/json" }), async (req, res) => {
  const signature = req.headers["x-signature-256"] as string;
  const secret = process.env.TRONDEALER_WEBHOOK_SECRET!;
  const rawBody = req.body.toString("utf-8");

  const isValid = await verifyWebhookSignature(rawBody, signature, secret);

  if (!isValid) {
    return res.status(401).send("Invalid signature");
  }

  const payload = JSON.parse(rawBody);

  if (payload.event === "transaction.confirmed") {
    const { data } = payload;
    console.log(`Confirmed: ${data.amount} ${data.asset} on ${data.network}`);
  }

  res.sendStatus(200);
});
```

### Webhook Payloads

**incoming / confirmed events** share the same `WebhookPayload` shape:

```typescript
interface WebhookPayload {
  event: "transaction.incoming" | "transaction.confirmed";
  timestamp: string;
  data: {
    tx_hash: string;
    vout_index?: number | null;
    block_number: number;
    from_address?: string | null;
    to_address: string;
    asset: "USDT" | "USDC" | "BTC";
    amount: string;
    amount_native: string;
    price_usd: number;
    confirmations: number;
    wallet_label?: string | null;
    network:
      | "bsc"
      | "eth"
      | "pol"
      | "arb"
      | "base"
      | "opt"
      | "avax"
      | "tron"
      | "solana"
      | "sui"
      | "btc";
  };
}
```

**swept event** uses a different shape:

```typescript
interface WebhookSweptPayload {
  event: "transaction.swept";
  timestamp: string;
  data: {
    sweep_tx_hash?: string | null;
    fee_tx_hash?: string | null;
    funding_tx_hash?: string | null;
    source_tx_hashes: string[];
    asset: "USDT" | "USDC" | "BTC";
    amount: string;
    amount_native: string;
    gross_amount: string;
    gross_amount_native: string;
    fee_amount?: string | null;
    fee_amount_native?: string | null;
    price_usd: number;
    destination: string;
    wallet_address: string;
    wallet_label?: string | null;
    network:
      | "bsc"
      | "eth"
      | "pol"
      | "arb"
      | "base"
      | "opt"
      | "avax"
      | "tron"
      | "solana"
      | "sui"
      | "btc";
  };
}
```

## Error Handling

All API errors are thrown as `TronDealerError` instances:

```typescript
import { TronDealerError } from "@areitosa/trondealer-sdk";

try {
  await client.wallets.balance({ address: "invalid" });
} catch (error) {
  if (error instanceof TronDealerError) {
    console.error("API Error:", error.message);
    console.error("Status:", error.status);
    console.error("Response:", error.response);
  } else {
    console.error("Network error or timeout:", error);
  }
}
```

## Type Definitions

All request and response types are exported:

```typescript
import type {
  RegisterRequest,
  UpdateConfigRequest,
  ClientConfig,
  ClientFull,
  // EVM wallets
  AssignRequest,
  AssignedWallet,
  TransactionsRequest,
  Transaction,
  EvmBalances,
  EvmBalanceResponse,
  EvmTransactionsResponse,
  // TRON wallets
  TronAssignRequest,
  AssignedTronWallet,
  TronTransactionsRequest,
  TronTransaction,
  TronBalanceEntry,
  TronBalances,
  // Solana wallets
  SolAssignRequest,
  AssignedSolWallet,
  SolTransactionsRequest,
  SolTransaction,
  SolBalanceEntry,
  SolBalances,
  // SUI wallets
  SuiAssignRequest,
  AssignedSuiWallet,
  SuiTransactionsRequest,
  SuiTransaction,
  SuiBalanceEntry,
  SuiBalances,
  // Swap
  SwapStatus,
  SwapPair,
  SwapQuote,
  SwapFull,
  SwapPartial,
  SwapQuoteRequest,
  SwapCreateRequest,
  SwapUnlockRequest,
  // Networks
  NetworkInfo,
  NetworkAsset,
  // Webhooks
  WebhookPayload,
  WebhookSweptPayload,
  WebhookSweptData,
  WebhookTransactionData,
  WebhookNetwork,
  // Enums
  Network,
  Asset,
  TransactionStatus,
  WalletStatus,
  WebhookEvent,
  PayoutMethod,
  // Config
  TronDealerConfig,
  TronDealerOptions,
  Transport,
} from "@areitosa/trondealer-sdk";
```

## Configuration Options

| Option    | Type     | Default                    | Description                        |
| --------- | -------- | -------------------------- | ---------------------------------- |
| `apiKey`  | `string` | `undefined`                | API key for authenticated requests |
| `baseUrl` | `string` | `'https://trondealer.com'` | API base URL                       |
| `timeout` | `number` | `10000`                    | Request timeout in milliseconds    |

## Development

```bash
git clone https://github.com/Dantescur/trondealer-sdk.git
cd trondealer-sdk
pnpm install

pnpm run build      # Build ESM bundles with tsdown
pnpm run dev        # Watch mode
pnpm run typecheck  # Run TypeScript type checking
pnpm run test       # Run tests with Vitest
pnpm run lint       # Lint with oxlint
pnpm run lint:fix   # Lint and auto-fix
pnpm run fmt        # Format with oxfmt
pnpm run fmt:check  # Check formatting
pnpm run changelog  # Generate/update CHANGELOG.md
pnpm run release    # Bump version, update changelog, commit, tag, push
```

Hooks (husky + lint-staged) auto-run `lint:fix` and `oxfmt` on staged files before each commit.

### Releasing

```bash
pnpm run release
```

`bumpp` bumps the version, auto-generates `CHANGELOG.md` via the `execute` hook in `bump.config.ts`, commits everything, creates a git tag, and pushes to GitHub. The tag push triggers CI which publishes to npm and creates a GitHub Release with formatted release notes.

### Project Structure

```sh
src/
├── index.ts               # Public exports
├── client.ts              # Main TronDealer class (6 resource properties)
├── config.ts              # Config types + normalize function
├── http.ts                # TronDealerHttpClient, Transport, TronDealerError
├── types.ts               # API request/response types
├── resources/
│   ├── clients.ts         # Client management endpoints
│   ├── wallets.ts         # EVM wallet endpoints
│   ├── tron.ts            # TRON wallet endpoints
│   ├── sol.ts             # Solana wallet endpoints
│   ├── sui.ts             # SUI wallet endpoints
│   ├── networks.ts        # Network discovery endpoint
│   └── swap.ts            # Cross-chain swap endpoints
└── utils/
    └── webhooks.ts        # HMAC signature verification
```

## License

MIT License. See [LICENSE](./LICENSE) file for details.

## Support

- Issues: https://github.com/Dantescur/trondealer-sdk/issues
- API Reference: https://trondealer.com/en/docs

## Security Considerations

1. Store your API key and webhook secret in environment variables, never in source code
2. Always verify webhook signatures before processing events
3. Use HTTPS for all webhook endpoints
4. Rotate your webhook secret periodically
5. Validate all incoming webhook data before use in your application
