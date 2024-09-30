import { PlaybackContext } from '@/app/context/playbackContext';
import { player } from '@/scripts/player';
import { useContext, useEffect, useState } from 'react';

export const useTrackChange = (index: number) => {
  const [trackIndex, setTrackIndex] = useState(index);
  const { playbackData, setPlaybackData } = useContext(PlaybackContext);

  const playNextTrack = async (trackIndex: number) => {
    if (playbackData.currentTrackNumberInPlaylist === trackIndex) {
      return;
    }
    if (playbackData.currentPlaylistData) {
      const nextTrackUrl = playbackData.currentPlaylistData[trackIndex].previewUrl;
      const newSound = await player.createPlayback(nextTrackUrl);

      if (playbackData.currentSound) {
        await player.stopTrack(playbackData.currentSound);
        await player.unloadSound(playbackData.currentSound);

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
        player.playTrack(newSound);
      }
    }
  };

  useEffect(() => {
    playNextTrack(trackIndex);
  }, [trackIndex]);

  return setTrackIndex;
};
