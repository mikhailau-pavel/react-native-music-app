import { AsyncStorageKeys, storage } from '@/scripts/asyncStorage';

enum AlbumsRequestUrls {
  ALBUM_INFO = 'https://api.spotify.com/v1/albums/',
}

export const getAlbum = async (id: string) => {
  try {
    const token = await storage.getData(AsyncStorageKeys.ACCESS_TOKEN);
    const response = await fetch(`${AlbumsRequestUrls.ALBUM_INFO}${id}`, {
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
