export interface GetJWTRequest {
  oauthToken: string;
}

export interface GetJWTResponse {
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  id: string,
  type: string
}

export interface JWTOptions {
  expiresIn: string
}
