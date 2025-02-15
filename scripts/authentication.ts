import * as Crypto from 'expo-crypto';
import { AsyncStorageKeys, storage } from './asyncStorage';
import { makeRedirectUri } from 'expo-auth-session';

enum AuthURLs {
  TOKEN = 'https://accounts.spotify.com/api/token',
}

export const generateRandomString = (length: number) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = Crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc: string, x: number) => acc + possible[x % possible.length], '');
};

export const sha256 = async (plain: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return Crypto.digest(Crypto.CryptoDigestAlgorithm.SHA256, data);
};

export const base64encode = (input: ArrayBuffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

export const hashed = async () => {
  const codeVerifier = generateRandomString(44);
  await storage.storeData('code_verifier', codeVerifier);
  return await sha256(codeVerifier);
};

export const codeChallenge = async () => {
  const hash = await hashed();
  return base64encode(hash);
};

export const parseResponseCode = (string: string) => {
  return string.split('code=')[1];
};

export const createLoginUrl = async () => {
  const codeVerifier = generateRandomString(44);
  storage.storeData('code_verifier', codeVerifier);
  const sha = await sha256(codeVerifier);
  const base64String = base64encode(sha);
  const redirectUri = `${makeRedirectUri({ scheme: 'musicapp', path: 'home' })}`;
  const authUrl = new URL('http://accounts.spotify.com/authorize');
  const params = {
    response_type: 'code',
    client_id: 'e6d38f8e338847f0a2909ea813ec79e4',
    //process.env.CLIENT_ID,
    scope:
      'user-read-private user-read-email user-top-read playlist-modify-public playlist-modify-private',
    //process.env.SCOPE_LOGIN,
    code_challenge_method: 'S256',
    //process.env.CHALLENGE_METHOD,
    code_challenge: base64String,
    redirect_uri: redirectUri,
    //process.env.REDIRECT_URI,
  };

  authUrl.search = new URLSearchParams(params).toString();
  return authUrl.toString();
};

export const requestAccessToken = async () => {
  const codeVerifier = (await storage.getData(AsyncStorageKeys.CODE_VERIFIER)) || '';
  const code = (await storage.getData(AsyncStorageKeys.RESPONSE_CODE)) || '';
  const redirectUri = `${makeRedirectUri({ scheme: 'musicapp', path: 'home' })}`;
  const params: Record<string, string> = {
    client_id: 'e6d38f8e338847f0a2909ea813ec79e4',
    //process.env.CLIENT_ID,
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    //process.env.REDIRECT_URI,
    code_verifier: codeVerifier,
  };

  const payloadBody = Object.keys(params)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
    .join('&');

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: payloadBody,
  };
  try {
    const response = await fetch(AuthURLs.TOKEN, payload);
    const result = await response.json();
    return result;
  } catch (err) {
    throw new Error(`Error message: ${err}`);
  }
};
