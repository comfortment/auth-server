import * as jwt from "jsonwebtoken";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

import { JWTPayload, JWTOptions } from "../../../types/provideJWTTypes";
import { dynamoDBClient } from "../../../aws"
import { DYNAMODB_COMFORTMENT_AUTH } from "../../../constant";


export const generateJWT = async (payload: JWTPayload, options: JWTOptions): Promise<string> => {
  const jwtSecretKey = process.env.SECRET_KEY

  return jwt.sign(payload, jwtSecretKey, options);
};

export const saveRefreshToken = async (id: string, refreshToken: string) => {
  const refreshTokenData: DocumentClient.PutItemInput = {
    TableName: DYNAMODB_COMFORTMENT_AUTH,
    Item: {
      id,
      refreshToken
    }
  };

  try {
    await dynamoDBClient.put(refreshTokenData).promise();
  } catch (err) {
    console.error(err);
    throw err;
  }
};
