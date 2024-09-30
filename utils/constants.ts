import { PlaylistItemData } from "@/types/types";

export const ActivityItemProps = [
  { rotate: '0deg', delay: 0 },
  { rotate: '45deg', delay: 100 },
  { rotate: '90deg', delay: 200 },
  { rotate: '135deg', delay: 300 },
  { rotate: '180deg', delay: 400 },
  { rotate: '225deg', delay: 500 },
  { rotate: '270deg', delay: 600 },
  { rotate: '315deg', delay: 700 },
];

export const AllAsyncStorageKeys = [
  'access_token',
  'refresh_token',
  'code_verifier',
  'responseCode',
  'playlists',
];

export const mockImage = 'https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228';

export const playlistsMockList: PlaylistItemData[] = [
  {
    title: 'Playlist_item_1',
    id: 'playlist-1',
    imageURL: mockImage,
    playlistId: '3cEYpjA9oz9GiPac4AsH4n',
  },
  {
    title: 'Playlist_item_2',
    id: 'playlist-2',
    imageURL: mockImage,
    playlistId: '3cEYpjA9oz9GiPac4AsH4n',
  },
  {
    title: 'Playlist_item_3',
    id: 'playlist-3',
    imageURL: mockImage,
    playlistId: '3cEYpjA9oz9GiPac4AsH4n',
  },
  {
    title: 'Playlist_item_4',
    id: 'playlist-4',
    imageURL: mockImage,
    playlistId: '3cEYpjA9oz9GiPac4AsH4n',
  },
];


export const mockNowPlayingItem = { song: 'Song 1', artist: 'Artist 1' };