# Tron Dealer V2 SDK

TypeScript SDK for the Tron Dealer V2 API. Provides type-safe access to EVM
wallet management across multiple networks (BSC, Ethereum, Polygon, Arbitrum,
Base), including client registration, wallet assignment, balance queries,
transaction history, and webhook verification.

## Installation

```bash
npm install @areitosa/trondealer-sdk
# or
pnpm add @areitosa/trondealer-sdk
# or
yarn add @areitosa/trondealer-sdk
```

## Requirements

- Node.js 18 or higher
- TypeScript 5.0 or higher (for type checking)
- A Tron Dealer API key (obtained after client registration)

## Quick Start

### Initialize the Client

```typescript
import { TronDealer } from '@areitosa/trondealer-sdk';

// Public endpoints (no API key required)
const publicClient = new TronDealer();

// Authenticated requests (after registration)
const client = new TronDealer({
  apiKey: 'td_your_api_key_here',
  baseUrl: 'https://trondealer.com', // optional, default shown
  timeout: 15000 // optional, default: 10000ms
});
```

### Register a New Client

```typescript
const registered = await publicClient.clients.register({
  name: 'My Business',
  webhook_url: 'https://myapp.com/webhooks/trondealer',
  webhook_secret: 'your_webhook_secret',
  min_confirmations: 12,
  payout_method: 'wallet',
  sweep_wallet: '0xYourEVMAddressHere'
});

console.log('API Key:', registered.api_key);
// Store this key securely - it is only returned once
```

### Assign a Deposit Wallet

```typescript
const wallet = await client.wallets.assign({
  label: 'user-12345' // optional identifier
});

console.log('Wallet Address:', wallet.address);
console.log('Status:', wallet.status);
```

### Check Wallet Balances

```typescript
const balances = await client.wallets.balance({
  address: '0xAssignedWalletAddress'
});

console.log('Native Token:', balances.NativeToken);
console.log('USDT:', balances.USDT);
console.log('USDC:', balances.USDC);
```

### Query Transaction History

```typescript
const transactions = await client.wallets.transactions({
  address: '0xAssignedWalletAddress',
  limit: 25,
  offset: 0,
  status: 'confirmed' // optional filter: 'detected' | 'confirmed' | 'notified'
  | 'swept'
});

for (const tx of transactions.data) {
  console.log(`${tx.asset} ${tx.amount} - ${tx.status}`);
}
```

### Manage Client Configuration

```typescript
// Get current configuration
const config = await client.clients.me();
console.log('Webhook configured:', config.has_webhook_secret);

// Update configuration
const updated = await client.clients.update({
  webhook_url: 'https://new-endpoint.com/webhook',
  min_confirmations: 20
});
```

## Webhook Verification

Tron Dealer sends webhook notifications to your configured URL when deposits
are detected or confirmed. Always verify the signature to ensure the request
originates from Tron Dealer.

```typescript
import { verifyWebhookSignature } from '@areitosa/trondealer-sdk';
import express from 'express';

const app = express();

// Use raw body parser for signature verification
app.post('/webhooks/trondealer', express.raw({ type: 'application/json' }), 
async (req, res) => {
  const signature = req.headers['x-webhook-signature'] as string;
  const secret = process.env.TRONDEALER_WEBHOOK_SECRET!;
  const rawBody = req.body.toString('utf-8');

  const isValid = await verifyWebhookSignature(rawBody, signature, secret);
  
  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }

  const payload = JSON.parse(rawBody);
  
  // Process the webhook event
  if (payload.event === 'transaction.confirmed') {
    const { data } = payload;
    console.log(`Confirmed: ${data.amount} ${data.asset} on ${data.network}`);
    // Your business logic here
  }

  res.sendStatus(200);
});
```

### Webhook Payload Structure

```typescript
interface WebhookPayload {
  event: 'transaction.incoming' | 'transaction.confirmed';
  timestamp: string; // ISO 8601
  data: {
    tx_hash: string;
    block_number: number;
    from_address: string;
    to_address: string;
    asset: 'USDT' | 'USDC';
    amount: string;
    confirmations: number;
    wallet_label?: string | null;
    network: 'bsc' | 'eth' | 'pol';
  };
}
```

## Error Handling

All API errors are thrown as `TronDealerError` instances:

```typescript
import { TronDealerError } from '@areitosa/trondealer-sdk';

try {
  await client.wallets.balance({ address: 'invalid' });
} catch (error) {
  if (error instanceof TronDealerError) {
    console.error('API Error:', error.message);
    console.error('Status:', error.status);
    console.error('Response:', error.response);
  } else {
    // Network errors, timeouts, etc.
    console.error('Request failed:', error);
  }
}
```

## Type Definitions

All request and response types are exported for use in your application:

```typescript
import type {
  RegisterRequest,
  ClientConfig,
  AssignedWallet,
  Transaction,
  WebhookPayload,
  TransactionStatus,
  PayoutMethod,
  TronDealerConfig,
  TronDealerOptions,
  Transport
} from '@areitosa/trondealer-sdk';
```

## Configuration Options

| Option | Type | Default | Description |
| -------- | ------ | --------- | ------------- |
| `apiKey` | `string` | `undefined` | API key for authenticated requests |
| `baseUrl` | `string` | `'https://trondealer.com'` | API base URL |
| `timeout` | `number` | `10000` | Request timeout in milliseconds |

## Development

### Clone and Install

```bash
git clone https://github.com/Dantescur/trondealer-sdk.git
cd trondealer-sdk
pnpm install
```

### Available Scripts

```bash
pnpm run build      # Build ESM bundles with tsdown
pnpm run dev        # Watch mode for development
pnpm run typecheck  # Run TypeScript type checking
pnpm run test       # Run tests with Vitest
pnpm run release    # Bump version and prepare release
```

### Project Structure

```sh
src/
├── index.ts              # Public exports
├── client.ts             # Main TronDealer class (config normalization, resource wiring)
├── config.ts             # TronDealerConfig type + normalize function
├── http.ts               # TronDealerHttpClient, Transport interface, TronDealerError
├── types.ts              # API request/response types
├── resources/
│   ├── clients.ts        # Client management endpoints
│   └── wallets.ts        # Wallet and transaction endpoints
└── utils/
    └── webhooks.ts       # HMAC signature verification
```

## Building

The SDK is bundled using tsdown, producing:

- `dist/index.mjs` - ES Module build
- `dist/index.d.mts` - TypeScript declarations

```bash
pnpm run build
```

## License

MIT License. See [LICENSE](./LICENSE) file for details.

## Support

- Documentation: <https://github.com/Dantescur/trondealer-sdk>
- Issues: <https://github.com/Dantescur/trondealer-sdk/issues>
- API Reference: <https://trondealer.com/en/docs>

## Security Considerations

1. Store your API key and webhook secret in environment variables, never in
source code
2. Always verify webhook signatures before processing events
3. Use HTTPS for all webhook endpoints
4. Rotate your webhook secret periodically
5. Validate all incoming webhook data before use in your application
