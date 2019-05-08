import * as uuid from "uuid/v4";
import { Handler } from "aws-lambda";

import veriryOauth from "./oauth"
import generateJWT from "./jwt"
import { GetJWTRequest, GetJWTResponse } from "../../../types/provideJWTTypes"


const handler: Handler = async (event: GetJWTRequest, _, __): Promise<GetJWTResponse>  => {
  // event.oauthToken 을 oauth server 로 oauth serve request prameter 로 하여 요청
  await veriryOauth(event.oauthToken);

  let identity = uuid();

  let access = await generateJWT({id: identity, type: 'access'}, {expiresIn: '3h'});
  let refresh = await generateJWT({id: identity, type: 'refresh'}, {expiresIn: '30d'});

  return {
    accessToken: access,
    refreshToken: refresh
  }
};

export default handler;
