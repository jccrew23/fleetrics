import { google } from "googleapis";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

export function getGoogleAuthClient(accessToken, refreshToken) {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    process.env.GOOGLE_OAUTH_REDIRECT_URI
  );

  oAuth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  return oAuth2Client;
}

export async function getServiceAccountAuth() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(process.cwd(), "service-acct-key.json"),
    scopes: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/spreadsheets"
    ],
  });

  const authClient = await auth.getClient(); // ✅ get the actual client
  return authClient;
}
