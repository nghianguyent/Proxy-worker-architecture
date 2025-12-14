export interface TTokenPayload {
  jti: string;
  sub: string;
  email: string;
  iat: number;
  exp: number;
  aud: string;
}
