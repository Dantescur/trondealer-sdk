import type { TronDealerHttpClient } from "../http";
import type {
  ClientConfigResponse,
  RegisterRequest,
  RegisterResponse,
  UpdateConfigRequest,
} from "../types";

export class ClientsResource {
  constructor(private readonly http: TronDealerHttpClient) {}

  register(data: RegisterRequest) {
    return this.http.post<RegisterResponse>("/api/v2/clients/register-open", data);
  }

  me() {
    return this.http.get<ClientConfigResponse>("/api/v2/clients/me");
  }

  update(data: UpdateConfigRequest) {
    return this.http.patch<ClientConfigResponse>("/api/v2/clients/me", data);
  }
}
