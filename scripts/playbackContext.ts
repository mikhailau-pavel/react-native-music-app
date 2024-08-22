import { createContext } from 'react';

export type PlaybackData = {
  currentArtist: string,
    currentSong: string,
    currentAlbumImage: string,
    currentTrackUrl: string,
    isPlaying: boolean,
}

export type PlaybackDataContext = {
  playbackData: PlaybackData,
  setPlaybackData: React.Dispatch<React.SetStateAction<PlaybackData>>,
}

export const initialPlaybackData: PlaybackData = 
  {
    currentArtist: '',
    currentSong: '',
    currentAlbumImage: '',
    currentTrackUrl: '',
    isPlaying: false,
  }


export const initialPlaybackContext: PlaybackDataContext = {
  playbackData: initialPlaybackData,
  setPlaybackData: (): void => {},
};

export const PlaybackContext = createContext(initialPlaybackContext);
