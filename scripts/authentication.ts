import 'core-js/actual/url';
import 'core-js/actual/url-search-params';
import * as Crypto from 'expo-crypto';
import { Platform } from 'react-native';
import { storeData } from './asyncStorage';

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
  console.warn('CODE_VERIFIER', codeVerifier);
  storeData('code_verifier', codeVerifier);
  return await sha256(codeVerifier);
};

export const codeChallenge = async () => {
  const hash = await hashed();
  return base64encode(hash);
};

export const parseResponseCode = (string: string) => {
  //acc origin url + fixed part of response?
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    return string.substring(35);
  }
  return string.substring(14);
};

export const requestAccessToken = async (authCode: string) => {};
