import { TrackItemData } from '@/types/types';
import { Audio } from 'expo-av';
import { createContext } from 'react';

export type PlaybackData = {
  currentArtist: string;
  currentSong: string;
  currentAlbumImage: string;
  currentTrackUrl: string;
  isPlaying: boolean;
  isShowing: boolean;
  currentSound: Audio.Sound | null;
  currentPlaylistData: TrackItemData[] | [];
  currentTrackNumberInPlaylist: number;
};

export type PlaybackDataContext = {
  playbackData: PlaybackData;
  setPlaybackData: React.Dispatch<React.SetStateAction<PlaybackData>>;
};

export const initialPlaybackData: PlaybackData = {
  currentArtist: '',
  currentSong: '',
  currentAlbumImage: ' ',
  currentTrackUrl: '',
  isPlaying: false,
  isShowing: false,
  currentSound: null,
  currentPlaylistData: [],
  currentTrackNumberInPlaylist: 0,
};

export const initialPlaybackContext: PlaybackDataContext = {
  playbackData: initialPlaybackData,
  setPlaybackData: (): void => {},
};

export const PlaybackContext = createContext(initialPlaybackContext);
