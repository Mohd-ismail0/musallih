import { createApiClient } from "./client";
import { DEFAULT_API_BASE_URL } from "./config";

export interface ExchangeTokenRequest {
  id_token: string;
}

export interface ExchangeTokenResponse {
  access_token: string;
  expires_in: number;
}

export async function exchangeFirebaseToken(
  idToken: string,
  baseUrl = DEFAULT_API_BASE_URL
): Promise<ExchangeTokenResponse> {
  const api = createApiClient({ baseUrl });
  return api.post<ExchangeTokenResponse>("/auth/token", {
    id_token: idToken,
  } satisfies ExchangeTokenRequest);
}
