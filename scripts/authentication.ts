import { AuthParams } from '@/types/types';
import 'core-js/actual/url';
import 'core-js/actual/url-search-params';
import * as Crypto from 'expo-crypto';
import { Linking } from 'react-native';

const generateRandomString = (length: number) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = Crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc: string, x: number) => acc + possible[x % possible.length], '');
};

const sha256 = async (plain: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return Crypto.digest(Crypto.CryptoDigestAlgorithm.SHA256, data);
};

const base64encode = (input: ArrayBuffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

const hashed = async () => {
  return await sha256(generateRandomString(43));
};

const codeChallenge = async () => {
  const hash = await hashed()
  return base64encode(hash);
};

//app key for test purposes only
const clientId = process.env.CLIENT_ID ? process.env.CLIENT_ID : 'e6d38f8e338847f0a2909ea813ec79e4';
const redirectUri = 'http://localhost:8081';
const scope = 'user-read-private user-read-email';

export { generateRandomString, codeChallenge };
