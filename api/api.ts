import { getData, removeData, storeData } from '@/scripts/asyncStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

enum RequestUrls {
  //TOKEN = 'https://accounts.spotify.com/api/token',
  CURRENT_USER_PLAYlISTS = 'https://api.spotify.com/v1/me/playlists',
}


const requestRefreshToken = async () => {
  const refreshToken = (await getData('refresh_token')) || '';
  const params: Record<string, string> = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: 'e6d38f8e338847f0a2909ea813ec79e4',
    //process.env.CLIENT_ID,
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
  //const body = await fetch(RequestUrls.TOKEN, payload);
  //const response = await body.json();
  // if (response.error_description && response.error_description === 'Refresh token revoked') {
  //   await removeData('access_token');
  //   await removeData('refresh_token');
  //   //requestAccessToken();
  // } else {
  //   await storeData('access_token', response.access_token);
  //   await storeData('refresh_token', response.refresh_token);
  // }
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
  if (playlistsData) {
    await storeData('playlists', playlistsData);
  }
  return data.items;
};

const fetchTracksFromPlaylist = async (playlistId: string) => {
  const token = await getData('access_token');
  const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks/`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    const data = await response.json();
    if (data.error && data.error.message === 'The access token expired') {
      requestRefreshToken();
    } else if (data.error && data.error.message === 'Invalid access token') {
     // await requestAccessToken();
    } else {
      return data.items;
    }
  } catch (err) {
    console.error(err);
  }
};

const resetAccessToken = async () => {
  //console.log('reset happening');
  await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'code_verifier', 'responseCode', 'playlists'])
  //console.log('state', await AsyncStorage.multiGet(['access_token', 'refresh_token', 'code_verifier', 'responseCode', 'playlists']))
};

export {
  fetchCurrentUserPlaylists,
  //requestAccessToken,
  fetchTracksFromPlaylist,
  requestRefreshToken,
  resetAccessToken,
};
