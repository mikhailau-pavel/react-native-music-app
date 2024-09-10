import { getData } from '@/scripts/asyncStorage';

enum AlbumsRequestUrls {
  ALBUM_INFO = 'https://api.spotify.com/v1/albums/',
}

export const getAlbum = async (id: string) => {
  const token = await getData('access_token');
  const response = await fetch(`${AlbumsRequestUrls.ALBUM_INFO}${id}`, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
  const data = await response.json();
  return data;
};
