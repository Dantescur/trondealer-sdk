import type { RequestOptions } from './utils/http';
import { ClientsResource } from './resources/clients';
import { WalletsResource } from './resources/wallets';
import { verifyWebhookSignature } from './utils/webhooks';

export class TronDealer {
  public readonly clients: ClientsResource;
  public readonly wallets: WalletsResource;

  constructor(options: { apiKey?: string; baseUrl?: string; timeout?: number } = {}) {
    const opts: RequestOptions = {
      apiKey: options.apiKey,
      baseUrl: options.baseUrl,
      timeout: options.timeout,
    };
    this.clients = new ClientsResource(opts);
    this.wallets = new WalletsResource(opts);
  }

  /**
   * Verify HMAC-SHA256 webhook signature
   */
  verifyWebhook(rawBody: string, signature: string, secret: string) {
    return verifyWebhookSignature(rawBody, signature, secret);
  }
}
