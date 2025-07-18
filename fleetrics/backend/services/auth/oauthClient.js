import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

export const oAuth2Client = new google.auth.OAuth2 (
    process.env.REACT_APP_GOOGLE_CLIENT_ID,
    process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
    process.env.REACT_APP_GOOGLE_REDIRECT_URI
);