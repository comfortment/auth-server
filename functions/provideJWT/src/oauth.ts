import axios from "axios"

import { DeveloperTokenPayload, VerifyReponse } from "../../../types/provideJWTTypes"

export const verifyFacebook = async (oauthToken: string): Promise<boolean> => {
  const environmentVars = process.env;
  const developerToken: DeveloperTokenPayload = await axios.get(
    environmentVars.FACEBOOK_DEVELOPERS_URL,
    {
      params: {
        client_id: environmentVars.FACEBOOK_APP_ID,
        client_secret: environmentVars.FACEBOOK_APP_SECRET,
        grant_type: "client_credentials"
      }
    }
  );

  const verifyResponse: VerifyReponse = await axios.get(environmentVars.FACEBOOK_VERIFY_URL, {
    params: {
      input_token: oauthToken,
      access_token: developerToken.data.access_token
    }
  });

  return verifyResponse.data.data.is_valid;
};

export const verifyKakao = async (token: string): Promise<boolean> => {
  return true;
};
