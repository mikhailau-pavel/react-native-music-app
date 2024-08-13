import { getData, storeData } from '@/scripts/asyncStorage';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

enum RequestUrls {
  TOKEN = 'https://accounts.spotify.com/api/token',
  CURRENT_USER_PLAYlISTS = 'https://api.spotify.com/v1/me/playlists',
}

const requestAccessToken = async () => {
  const codeVerifier = (await getData('code_verifier')) || '';
  const code = (await getData('responseCode')) || '';
  const params: Record<string, string> = {
    client_id: 'e6d38f8e338847f0a2909ea813ec79e4',
    //process.env.CLIENT_ID,
    grant_type: 'authorization_code',
    code,
    redirect_uri: 'http://localhost:8081/profile',
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

  const body = await fetch(RequestUrls.TOKEN, payload);
  const response = await body.json();
  await storeData('access_token', response.access_token);
  await storeData('refresh_token', response.refresh_token);
  console.warn('acc2code', payload.body);
  console.warn('acc2response', response);
  console.log('test', await getData('refresh_token'));
};

const fetchCurrentUserPlaylists = async () => {
  const token = await getData('access_token');
  const response = await fetch(RequestUrls.CURRENT_USER_PLAYlISTS, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
  const data = await response.json();
  const playlistsData = JSON.stringify(data.items);
  await storeData('playlists', playlistsData);
  return data.items;
};

export { fetchCurrentUserPlaylists, requestAccessToken };
