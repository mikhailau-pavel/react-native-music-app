import { PlaybackContext } from '@/app/context/playbackContext';
import { createPlayback, playTrack, stopTrack, unloadSound } from '@/scripts/player';
import { useContext, useEffect, useState } from 'react';

export const useTrackChange = (index: number) => {
  const [trackIndex, setTrackIndex] = useState(index);
  const { playbackData, setPlaybackData } = useContext(PlaybackContext);

  const playNextTrack = async (trackIndex: number) => {
    if (playbackData.currentTrackNumberInPlaylist === trackIndex) {
      return;
    }
    const nextTrackUrl = playbackData.currentPlaylistData[trackIndex].previewUrl;
    const newSound = await createPlayback(nextTrackUrl);

    if (playbackData.currentSound) {
      await stopTrack(playbackData.currentSound);
      await unloadSound(playbackData.currentSound);

      setPlaybackData({
        ...playbackData,
        currentArtist: playbackData.currentPlaylistData[trackIndex].artist,
        currentSong: playbackData.currentPlaylistData[trackIndex].title,
        currentSound: newSound,
        currentAlbumImage: playbackData.currentPlaylistData[trackIndex].imageURL,
        currentTrackNumberInPlaylist: trackIndex,
        isPlaying: true,
      });
      // progress.value = 0;
      playTrack(newSound);
    }
  };

  useEffect(() => {
    playNextTrack(trackIndex);
  }, [trackIndex]);

  return setTrackIndex;
};
