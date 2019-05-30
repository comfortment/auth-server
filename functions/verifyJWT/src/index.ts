import { Handler } from "aws-lambda";
import * as jwt from "jsonwebtoken";

import { AuthorizerInput, AuthorizerOutput } from "../../../types/authorizerTypes";
import { PolicyDocument, Statement } from "../../../types/authorizerTypes"
import { JWTPayload } from "../../../types/JWTTypes";


const handler: Handler = async (
  event: AuthorizerInput, _, __
): Promise<AuthorizerOutput | string> => {
  const [prefix, token] = event.authorizationToken.split(" ");
  let decodedToken: JWTPayload;

  if (prefix != "Bearer") { throw "Unauthorized"; }

  try {
    decodedToken = jwt.verify(token, process.env.SECRET_KEY) as JWTPayload;
  } catch (err) {
    console.error(err);
    throw "Unauthorized";
  }

  if (decodedToken.type != "access") { throw "Unauthorized"; }

  return await generatePolicy('user', 'Allow', "*");
};

const generatePolicy = async (
  principalId: string , effect?: string, resource?: string
): Promise<AuthorizerOutput> => {
  let authResponse: AuthorizerOutput = {} as AuthorizerOutput;

  authResponse.principalId = principalId;

  if (effect && resource) {
      let policyDocument: PolicyDocument = {} as PolicyDocument;
      policyDocument.Version = "2012-10-17";
      policyDocument.Statement = [];

      let statementOne: Statement = {} as Statement;
      statementOne.Action = 'execute-api:Invoke';
      statementOne.Effect = effect;
      statementOne.Resource = resource;

      policyDocument.Statement[0] = statementOne;
      authResponse.policyDocument = policyDocument;
  }

  return authResponse;
};

export default handler;
