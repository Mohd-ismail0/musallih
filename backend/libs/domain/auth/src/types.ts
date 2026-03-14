export interface JwtPayload {
  sub: string;
  client_id?: string;
  scopes: string[];
  org_id?: string;
  authority_level?: string;
  jurisdiction_codes?: string[];
  consent_hash?: string;
  iat?: number;
  exp?: number;
}
