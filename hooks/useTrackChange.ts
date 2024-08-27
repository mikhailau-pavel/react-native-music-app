import { PlaybackContext } from '@/scripts/playbackContext';
import { createPlayback, playTrack, stopTrack, unloadSound } from '@/scripts/player';
import { useContext, useEffect, useState } from 'react';

export const useTrackChange = (index: number) => {
  const [trackIndex, setTrackIndex] = useState(0);
  const { playbackData, setPlaybackData } = useContext(PlaybackContext);
  useEffect(() => {
    const playNextTrack = async (trackIndex: number) => {
      console.log('happening')
      if (playbackData.currentSound) {
        await stopTrack(playbackData.currentSound);
        await unloadSound(playbackData.currentSound);
        setPlaybackData({ ...playbackData, currentSound: null });
        const nextTrackUrl = playbackData.currentPlaylistData[trackIndex].previewUrl;
        const newSound = await createPlayback(nextTrackUrl);
        setPlaybackData({
          ...playbackData,
          currentArtist: 'test',
          currentSound: newSound,
          currentTrackNumberInPlaylist: trackIndex,
          isPlaying: true,
        });
        console.log('playbackData', playbackData.currentArtist, playbackData.currentSong);
        // progress.value = 0;
        playTrack(newSound);
      }
    };
      playNextTrack(trackIndex);
  }, [trackIndex]);

  return setTrackIndex;
};
