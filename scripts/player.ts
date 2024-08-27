import { Audio } from 'expo-av';

export const createPlayback = async (url: string) => {
  await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
  const track = await Audio.Sound.createAsync({ uri: url });
  await track.sound._loaded;
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
  if (sound) {
    await sound.stopAsync();
  }
};

export const unloadSound = async (sound: Audio.Sound) => {
  if (sound) {
    await sound.unloadAsync();
  }
}
