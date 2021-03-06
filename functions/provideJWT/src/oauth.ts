import axios from "axios";

import { DeveloperTokenPayload, VerifyReponse } from "../../../types/oauthTypes";


export const verifyFacebook = async (oauthToken: string): Promise<string | undefined> => {
  const environmentVars = process.env;

  let developerToken: DeveloperTokenPayload;
  let verifyResponse: VerifyReponse;


  try {
    developerToken = await axios.get(environmentVars.FACEBOOK_DEVELOPERS_URL,{
      params: {
        client_id: environmentVars.FACEBOOK_APP_ID,
        client_secret: environmentVars.FACEBOOK_APP_SECRET,
        grant_type: "client_credentials"
      }
    });
  } catch (err) {
    console.error(err);
    throw err;
  }

  try {
    verifyResponse = await axios.get(environmentVars.FACEBOOK_VERIFY_URL, {
      params: {
        input_token: oauthToken,
        access_token: developerToken.data.access_token
      }
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
  return verifyResponse.data.data.user_id;
};

export const verifyKakao = async (token: string): Promise<string | undefined> => {
  return;
};
