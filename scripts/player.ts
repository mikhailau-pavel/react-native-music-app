import { Audio } from 'expo-av';

class PlayerService {
  private static instance: PlayerService;

  private constructor() {}

  static getInstance() {
    if (!PlayerService.instance) {
      PlayerService.instance = new PlayerService();
    }
    return PlayerService.instance;
  }

  async createPlayback(url: string) {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: true });
    const track = await Audio.Sound.createAsync({ uri: url });
    await track.sound._loaded;
    return track.sound;
  }

  async playTrack(sound: Audio.Sound) {
    const result = await sound.playAsync();
    if (result.isLoaded) {
      return result.shouldPlay;
    } else return false;
  }

  async pauseTrack(sound: Audio.Sound) {
    const result = await sound.pauseAsync();
    if (result.isLoaded) {
      return result.shouldPlay;
    } else return true;
  }

  async stopTrack(sound: Audio.Sound) {
    if (sound) {
      await sound.stopAsync();
    }
  }

  async unloadSound(sound: Audio.Sound) {
    if (sound) {
      await sound.unloadAsync();
    }
  }

  calculateNewPlayPosition(progress: number, elementWidth: number): number {
    return Math.abs(Math.floor((progress * 100) / elementWidth)) * 290;
  }

  async playFromNewPosition(sound: Audio.Sound, position: number) {
    if (sound) {
      await sound.playFromPositionAsync(position);
    }
  }
}

export const player = PlayerService.getInstance();
