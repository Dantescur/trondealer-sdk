import type { TronDealerHttpClient } from '../http';
import type { ClientConfig, ClientFull, RegisterRequest, UpdateConfigRequest } from '../types';

export class ClientsResource {
  constructor(private readonly http: TronDealerHttpClient) {}

  register(data: RegisterRequest) {
    return this.http.post<ClientFull>('/api/v2/clients/register-open', data);
  }

  me() {
    return this.http.get<ClientConfig>('/api/v2/clients/me');
  }

  update(data: UpdateConfigRequest) {
    return this.http.patch<ClientConfig>('/api/v2/clients/me', data);
  }
}
