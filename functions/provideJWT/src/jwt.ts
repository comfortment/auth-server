import * as jwt from "jsonwebtoken"

import { JWTPayload, JWTOptions } from "../../../types/provideJWTTypes"

const generateJWT = async (payload: JWTPayload, options: JWTOptions): Promise<string> => {
  const jwtSecretKey = process.env.SECRET_KEY

  return jwt.sign(payload, jwtSecretKey, options);
};

export default generateJWT;
