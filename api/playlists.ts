import { storage } from '@/scripts/asyncStorage';

export const createPlaylist = async (
  playlistName: string,
  playlistDescription: string,
  userId: string
) => {
  const token = await storage.getData('access_token');
  const currentUserPlaylistsUrl = `https://api.spotify.com/v1/users/${userId}/playlists`;
  const bodyPayload = JSON.stringify({
    name: playlistName || 'New Playlist',
    description: playlistDescription || 'New playlist description',
    public: false,
  });

  try {
    const response = await fetch(currentUserPlaylistsUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: bodyPayload,
    });

    const data = await response.json();
    return data.id;
  } catch (err) {
    throw new Error(`Error message: ${err}`);
  }
};

export const addTracksToPlaylist = async (uris: string[], playlistId: string) => {
  const token = await storage.getData('access_token');
  const playlistUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  const payloadBody = JSON.stringify({
    uris: uris,
    position: 0,
  });

  const payload = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
    },
    body: payloadBody,
  };

  try {
    const response = await fetch(playlistUrl, payload);
    const data = await response.json();
  } catch (err) {
    throw new Error(`Error message: ${err}`);
  }
};
