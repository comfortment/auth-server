export interface JWTPayload {
  id: string,
  type: string
}

export interface JWTOptions {
  expiresIn: string
}
