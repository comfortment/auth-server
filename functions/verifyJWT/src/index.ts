import { Handler } from "aws-lambda";

import { AuthorizerInput, AuthorizerOutput } from "../../../types/authorizerTypes";
import { PolicyDocument, Statement } from "../../../types/authorizerTypes"


const handler: Handler = async (event: AuthorizerInput, _, __) => {
  const token = event.authorizationToken;

  // To do _ token 을 jwt.verify() 로 검증하여 allow, deny 로 바꾸기

  switch (token) {
    case "allow":
      return await generatePolicy('user', 'Allow', event.methodArn); // constant
    case "deny":
      return await generatePolicy('user', 'Deny', event.methodArn); // constant
    default:
      return "Unauthorized"; // constant
  }
};

const generatePolicy = async (principalId: string , effect?: string, resource?: string) => {
  let authResponse: AuthorizerOutput;
    
  authResponse.principalId = principalId;
  if (effect && resource) {
      let policyDocument: PolicyDocument;
      policyDocument.Version = '2012-10-17'; // change to current time
      policyDocument.Statement = [];

      let statementOne: Statement;
      statementOne.Action = 'execute-api:Invoke'; // change to constant value
      statementOne.Effect = effect;
      statementOne.Resource = resource;

      policyDocument.Statement[0] = statementOne;
      authResponse.policyDocument = policyDocument;
  }
  
  // Optional output with custom properties of the String, Number or Boolean type.
  // authResponse.context = {
  //     "stringKey": "stringval",
  //     "numberKey": 123,
  //     "booleanKey": true
  // };
  return authResponse;
};

export default handler;
