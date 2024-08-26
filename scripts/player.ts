import { Audio } from 'expo-av';

export const createPlayback = async (url: string) => {
  await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
  const track = await Audio.Sound.createAsync({ uri: url });
  return track.sound;
};

export const playTrack = async (sound: Audio.Sound) => {
  const result = await sound.playAsync();
  if (result.isLoaded) {
    return result.shouldPlay;
  } else return false;
};

export const pauseTrack = async (sound: Audio.Sound) => {
  const result = await sound.pauseAsync();
  if (result.isLoaded) {
    return result.shouldPlay;
  } else return true;
};

export const stopTrack = async (sound: Audio.Sound) => {
  if (sound) await sound.stopAsync();
};

export const playNextTrack = async (sound: Audio.Sound) => {
  await stopTrack(sound);
  ///t
  await sound.unloadAsync();
  setPlaybackData({ ...playbackData, currentSound: null });

  setPlaybackData({
    ...playbackData,
    currentTrackNumberInPlaylist: playbackData.currentTrackNumberInPlaylist + 1,
  });
  const nextTrackUrl =
    playbackData.currentPlaylistData[playbackData.currentTrackNumberInPlaylist + 1].previewUrl;
  const nextSound = await createPlayback(nextTrackUrl);
  await nextSound.playAsync();
  progress.value = 0;
  setPlaybackData({ ...playbackData, isPlaying: true });
};
