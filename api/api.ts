import { getData, storeData } from '@/scripts/asyncStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

enum RequestUrls {
  //TOKEN = 'https://accounts.spotify.com/api/token',
  CURRENT_USER_PLAYlISTS = 'https://api.spotify.com/v1/me/playlists',
  CURRENT_USER_TOPS = 'https://api.spotify.com/v1/me/top/',
  CURRENT_USER_PROFILE = 'https://api.spotify.com/v1/me',
}

export const requestRefreshToken = async () => {
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
};

export const fetchCurrentUserPlaylists = async () => {
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

export const fetchTracksFromPlaylist = async (playlistId: string) => {
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
    throw new Error(`Error message is:${err}`);
  }
};

export const resetAccessToken = async () => {
  await AsyncStorage.multiRemove([
    'access_token',
    'refresh_token',
    'code_verifier',
    'responseCode',
    'playlists',
  ]);
};

export const fetchUserTops = async (type: string, timeRange: string) => {
  const token = await getData('access_token');
  try {
    const response = await fetch(
      `${RequestUrls.CURRENT_USER_TOPS + type}?time_range=${timeRange}`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    );
    const data = await response.json();
    return data.items;
  } catch (err) {
    throw new Error(`Error message: ${err}`);
  }
};

export const fetchUserProfile = async () => {
  const token = await getData('access_token');
  try {
    const response = await fetch(RequestUrls.CURRENT_USER_PROFILE, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error(`Error message: ${err}`);
  }
};

