import * as jwt from "jsonwebtoken";
import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb"

import { AUTHORIZATION_HEADER } from "../../../constant";
import { JWT_ACCESS_TOKEN_EXPIRY } from "../../../constant";
import { JWTPayload } from "../../../types/JWTTypes";
import { AuthTable } from "../../../types/dynamoDBTypes";
import { DYNAMODB_COMFORTMENT_AUTH } from "../../../constant";
import { dynamoDBClient } from "../../../aws";


const handler: Handler = async (
  event: APIGatewayProxyEvent,
  _,
  __
): Promise<APIGatewayProxyResult> => {
  const jwtSecretKey = process.env.SECRET_KEY
  const refreshToken: string = event.headers[AUTHORIZATION_HEADER].split(" ")[1];
  let decodedToken: JWTPayload;

  try {
    decodedToken = jwt.verify(refreshToken, jwtSecretKey) as JWTPayload;
  } catch (err) {
    console.error(err);
    if (err instanceof jwt.TokenExpiredError || err instanceof jwt.JsonWebTokenError) {
      return { statusCode: 400, body: JSON.stringify({ message: err.message }) };
    } else {
      return { statusCode: 500, body: "" };
    }
  }

  if (decodedToken.type != 'refresh') {
    return { statusCode: 400, body: JSON.stringify({ message: "Incorrect token type" }) };
  }

  const dynamoGetParams: DocumentClient.GetItemInput = {
    TableName: DYNAMODB_COMFORTMENT_AUTH,
    Key: {
      id: decodedToken.id
    }
  };

  const data: DocumentClient.GetItemOutput = await dynamoDBClient.get(dynamoGetParams).promise();
  const authTable = data.Item as AuthTable;

  if (!data) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: "Unregistered user"
      })
    };
  } else if (authTable.refreshToken != refreshToken) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: "Unusable token"
      })
    }; 
  }

  const accessToken = jwt.sign(
    {id: authTable.id, type: "JWT"}, jwtSecretKey, {expiresIn: JWT_ACCESS_TOKEN_EXPIRY}
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
        accessToken
    })
  };
}

export default handler;
