export interface JWTPayload {
  id: string,
  type: string,
  role: string
}

export interface JWTOptions {
  expiresIn: string
}
