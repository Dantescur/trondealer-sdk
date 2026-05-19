import type { TronDealerOptions } from "./config";
import { normalizeConfig } from "./config";
import { FetchTransport, TronDealerHttpClient } from "./http";
import { ClientsResource } from "./resources/clients";
import { WalletsResource } from "./resources/wallets";
import { TronResource } from "./resources/tron";
import { SolResource } from "./resources/sol";
import { NetworksResource } from "./resources/networks";
import { SwapResource } from "./resources/swap";
import { verifyWebhookSignature } from "./utils/webhooks";

export class TronDealer {
  public readonly clients: ClientsResource;
  public readonly wallets: WalletsResource;
  public readonly tron: TronResource;
  public readonly sol: SolResource;
  public readonly networks: NetworksResource;
  public readonly swap: SwapResource;

  constructor(options: TronDealerOptions = {}) {
    const config = normalizeConfig(options);
    const transport = new FetchTransport(config.timeout);
    const httpClient = new TronDealerHttpClient(transport, config.baseUrl, config.apiKey);

    this.clients = new ClientsResource(httpClient);
    this.wallets = new WalletsResource(httpClient);
    this.tron = new TronResource(httpClient);
    this.sol = new SolResource(httpClient);
    this.networks = new NetworksResource(httpClient);
    this.swap = new SwapResource(httpClient);
  }

  verifyWebhook(rawBody: string, signature: string, secret: string) {
    return verifyWebhookSignature(rawBody, signature, secret);
  }
}
