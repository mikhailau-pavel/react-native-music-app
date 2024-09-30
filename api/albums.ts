import { AsyncStorageService } from '@/scripts/asyncStorage';

const storage = AsyncStorageService.getInstance();

enum AlbumsRequestUrls {
  ALBUM_INFO = 'https://api.spotify.com/v1/albums/',
}

export const getAlbum = async (id: string) => {
  const token = await storage.getData('access_token');
  const response = await fetch(`${AlbumsRequestUrls.ALBUM_INFO}${id}`, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
  const data = await response.json();
  return data;
};
