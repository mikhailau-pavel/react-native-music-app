import { AuthParams } from "@/types/types";
import 'core-js/actual/url';
import 'core-js/actual/url-search-params';
import * as Crypto from 'expo-crypto'

const generateRandomString = (length: number) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = Crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc: string, x: number) => acc + possible[x % possible.length], "");
  }

/*const codeVerifier  = generateRandomString(43);

const sha256 = async (plain: string) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return window.crypto.subtle.digest('SHA-256', data)
}

const base64encode = (input: ArrayBuffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

const hashed = await sha256(codeVerifier)
const codeChallenge = base64encode(hashed);

const clientId = process.env.CLIENT_ID ? process.env.CLIENT_ID : '';
const redirectUri = 'http://localhost:8081';

const scope = 'user-read-private user-read-email';
const authUrl = new URL("https://accounts.spotify.com/authorize")

window.localStorage.setItem('code_verifier', codeVerifier);

const params: AuthParams = {
  response_type: 'code',
  client_id: clientId,
  scope,
  code_challenge_method: 'S256',
  code_challenge: codeChallenge,
  redirect_uri: redirectUri,
}

authUrl.search = new URLSearchParams(params).toString();
const test2 = window.location.href = authUrl.toString();*/

export { generateRandomString }
