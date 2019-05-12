export interface AuthorizerInput {
  type: string,
  authorizationToken: string,
  methodArn: string
}

export interface AuthorizerOutput {
  principalId: string,
  policyDocument: PolicyDocument,
  // context?: {
  //   stringKey: string,
  //   numberKey: number,
  //   booleanKey: boolean
  // }
}

export interface PolicyDocument {
  Version: string,
  Statement: Array<Statement>
}

export interface Statement {
  Action: string,
  Effect: string,
  Resource: string
}
