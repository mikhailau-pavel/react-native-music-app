import { getData, storeData } from '@/scripts/asyncStorage';

enum RequestUrls {
  TOKEN = 'https://accounts.spotify.com/api/token',
  CURRENT_USER_PLAYlISTS = 'https://api.spotify.com/v1/me/playlists',
}

const requestAccessToken = async (code: string) => {
  let codeVerifier = await getData('code_verifier');

  const params = {
    client_id: 'e6d38f8e338847f0a2909ea813ec79e4',
    //process.env.CLIENT_ID,
    grant_type: 'authorization_code',
    code,
    redirect_uri: 'http://localhost:8081/profile',
    //process.env.REDIRECT_URI,
    code_verifier: codeVerifier,
  };

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(params),
  };
  const body = await fetch(RequestUrls.TOKEN, payload);
  const response = await body.json();
  storeData('access_token', response.access_token);
};
//accessToken: string
const fetchCurrentUserPlaylists = async () => {
  const token = await getData('access_token');
  const response = await fetch(RequestUrls.CURRENT_USER_PLAYlISTS, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
  const data = await response.json();
  console.log('playlists', data.items);
  return data.items;
};

export { fetchCurrentUserPlaylists, requestAccessToken };
