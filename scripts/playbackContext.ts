import { TrackItemData } from '@/types/types';
import { Audio } from 'expo-av';
import { createContext } from 'react';

export type Queue = {
  sections: {
    title: string;
    data: QueueItem;
  }[];
};

export type QueueItem = {
  song: string;
  artist: string;
};

export type PlaybackData = {
  currentArtist?: string;
  currentSong?: string;
  currentAlbumImage?: string;
  currentTrackUrl?: string;
  isPlaying?: boolean;
  isShowing?: boolean;
  currentSound?: Audio.Sound | null;
  currentPlaylistData?: TrackItemData[] | [];
  queue?: Queue;
  currentTrackNumberInPlaylist?: number;
};

export type PlaybackDataContext = {
  playbackData: PlaybackData;
  setPlaybackData: (input: PlaybackData) => void;
};

export const initialQueue: Queue = {
  sections: [
    {
      title: 'Now playing:',
      data: {
        song: '',
        artist: '',
      },
    },
    {
      title: 'Next from:',
      data: {
        song: '',
        artist: '',
      },
    },
  ],
};

export const initialPlaybackData: PlaybackData = {
  currentArtist: '',
  currentSong: '',
  currentAlbumImage: 'https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228',
  currentTrackUrl: '',
  isPlaying: false,
  isShowing: false,
  currentSound: null,
  currentPlaylistData: [],
  queue: initialQueue,
  currentTrackNumberInPlaylist: 0,
};

export const initialPlaybackContext: PlaybackDataContext = {
  playbackData: initialPlaybackData,
  setPlaybackData: (): void => {},
};

export const PlaybackContext = createContext<PlaybackDataContext>(initialPlaybackContext);
