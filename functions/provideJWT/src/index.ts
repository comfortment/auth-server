import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { verifyFacebook, verifyKakao } from "./oauth";
import { generateJWT, saveRefreshToken } from "./jwt";
import { AUTHORIZATION_HEADER } from "../../../constant"
import { JWT_ACCESS_TOKEN_EXPIRY, JWT_REFRESH_TOKEN_EXPIRY } from "../../../constant";


const handler: Handler = async (
  event: APIGatewayProxyEvent,
  _,
  __
): Promise<APIGatewayProxyResult>  => {
  let userId: string;
  const authorization = event.headers[AUTHORIZATION_HEADER].split(" ");
  const tokenType = authorization[0];
  const oauthToken = authorization[1];

  switch (tokenType) {
    case 'facebook':
      try {
        userId = await verifyFacebook(oauthToken);
      } catch (err) {
        return {statusCode: 500, body: ""};
      }
      break;
    
    case 'kakao':
      try {
        userId = await verifyKakao(oauthToken);
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

  if (!userId) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        "message": "Fail social authentication"
      })
    };
  } 

  const accessToken = await generateJWT(
    {id: userId, type: 'access'}, {expiresIn: JWT_ACCESS_TOKEN_EXPIRY}
  );
  const refreshToken = await generateJWT(
    {id: userId, type: 'refresh'}, {expiresIn: JWT_REFRESH_TOKEN_EXPIRY}
  );
  
  try {
    await saveRefreshToken(userId, refreshToken);
  } catch (err) {
    return {statusCode: 500, body: ""};
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      userId,
      accessToken,
      refreshToken
    })
  };  
};

export default handler;
