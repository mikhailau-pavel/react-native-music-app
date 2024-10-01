import { AsyncStorageKeys, storage } from '@/scripts/asyncStorage';

enum TracksRequestUrls {
  TRACK_INFO = 'https://api.spotify.com/v1/tracks/',
}

export const getTrackInfo = async (id: string) => {
  const token = await storage.getData(AsyncStorageKeys.ACCESS_TOKEN);
  try {
    const response = await fetch(`${TracksRequestUrls.TRACK_INFO}${id}`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error(`Error message:${err}`);
  }
};
