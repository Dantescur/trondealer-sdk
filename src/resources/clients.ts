import type { RequestOptions } from '../utils/http';
import { trondealerRequest } from '../utils/http';
import type { ClientConfig, ClientFull, RegisterRequest, UpdateConfigRequest } from '../types';

export class ClientsResource {
  constructor(private opts: RequestOptions) { }

  register(data: RegisterRequest) {
    return trondealerRequest<ClientFull>('/api/v2/clients/register-open', 'POST', data, this.opts);
  }

  me() {
    return trondealerRequest<ClientConfig>('/api/v2/clients/me', 'GET', undefined, this.opts);
  }

  update(data: UpdateConfigRequest) {
    return trondealerRequest<ClientConfig>('/api/v2/clients/me', 'PATCH', data, this.opts);
  }
}
