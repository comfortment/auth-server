export interface DeveloperTokenPayload { 
  data: {
    access_token: string,
    token_type: string
  }
}

export interface VerifyReponse {
  data: {
    data: {
      userId?: string
    }
  }
}
