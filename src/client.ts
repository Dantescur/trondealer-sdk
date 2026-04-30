import type { TronDealerOptions } from './config';
import { normalizeConfig } from './config';
import { FetchTransport, TronDealerHttpClient } from './http';
import { ClientsResource } from './resources/clients';
import { WalletsResource } from './resources/wallets';
import { verifyWebhookSignature } from './utils/webhooks';

export class TronDealer {
  public readonly clients: ClientsResource;
  public readonly wallets: WalletsResource;

  constructor(options: TronDealerOptions = {}) {
    const config = normalizeConfig(options);
    const transport = new FetchTransport(config.timeout);
    const httpClient = new TronDealerHttpClient(transport, config.baseUrl, config.apiKey);

    this.clients = new ClientsResource(httpClient);
    this.wallets = new WalletsResource(httpClient);
  }

  verifyWebhook(rawBody: string, signature: string, secret: string) {
    return verifyWebhookSignature(rawBody, signature, secret);
  }
}
