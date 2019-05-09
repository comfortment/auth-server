import * as uuid from "uuid/v4";
import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { verifyFacebook, verifyKakao } from "./oauth"
import { generateJWT, saveRefreshToken } from "./jwt"
import { APIGatewayProxyBody } from "../../../types/provideJWTTypes"

const handler: Handler = async (
  event: APIGatewayProxyEvent,
  _,
  __
): Promise<APIGatewayProxyResult>  => {
  let isValid: boolean;
  const payload: APIGatewayProxyBody = JSON.parse(event.body);

  switch (payload.tokenType) {
    case 'facebook':
      isValid = await verifyFacebook(payload.oauthToken);
      break;
    
    case 'kakao':
      isValid = await verifyKakao(payload.oauthToken);
      break;

    default:
      return {
        statusCode: 400,
        body: JSON.stringify({
          "message": "Unexpected token type"
        })
      }
  }

  if (isValid) {
    const identity = uuid();

    const accessToken = await generateJWT({id: identity, type: 'access'}, {expiresIn: '3h'});
    const refreshToken = await generateJWT({id: identity, type: 'refresh'}, {expiresIn: '30d'});
  
    await saveRefreshToken(refreshToken);
  
    return {
      statusCode: 200,
      body: JSON.stringify({
        userId: identity,
        accessToken: accessToken,
        refreshToken: refreshToken
      })
    }
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify({
        "message": "Fail social authentication"
      })
    }
  }
};

export default handler;
