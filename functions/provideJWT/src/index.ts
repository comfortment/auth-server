import * as uuid from "uuid/v4";
import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { verifyFacebook, verifyKakao } from "./oauth";
import { generateJWT, saveRefreshToken } from "./jwt";
import { AUTHORIZATION_HEADER } from "../../../constant"


const handler: Handler = async (
  event: APIGatewayProxyEvent,
  _,
  __
): Promise<APIGatewayProxyResult>  => {
  let isValid: boolean;
  const authorization = event.headers[AUTHORIZATION_HEADER].split(" ");
  const tokenType = authorization[0];
  const oauthToken = authorization[1];

  switch (tokenType) {
    case 'facebook':
      try {
        isValid = await verifyFacebook(oauthToken);
      } catch (err) {
        return {statusCode: 500, body: ""};
      }
      break;
    
    case 'kakao':
      try {
        isValid = await verifyKakao(oauthToken);
      } catch (err) {
        return {statusCode: 500, body: ""};
      }
      break;

    default:
      return {
        statusCode: 400,
        body: JSON.stringify({
          "message": "Unexpected token type"
        })
      };
  }

  if (isValid) {
    const identity = uuid();

    const accessToken = await generateJWT({id: identity, type: 'access'}, {expiresIn: '3h'});
    const refreshToken = await generateJWT({id: identity, type: 'refresh'}, {expiresIn: '30d'});
    
    try {
      await saveRefreshToken(identity, refreshToken);
    } catch (err) {
      return {statusCode: 500, body: ""};
    }
  
    return {
      statusCode: 200,
      body: JSON.stringify({
        userId: identity,
        accessToken,
        refreshToken
      })
    };
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify({
        "message": "Fail social authentication"
      })
    };
  }
};

export default handler;
