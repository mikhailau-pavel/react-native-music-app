import { PlayerScreenProps } from '@/types/types';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Image, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';

const PlayerScreen = ({ route, navigation }: PlayerScreenProps) => {
  const [sound, setSound] = useState<Sound>();
  const [currentTrackInPlaylist, setCurrentTrackInPlaylist] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const playlistInfoArr = route.params;
  const amountOfTracksInPlaylist = playlistInfoArr.length - 1;

  const playTrack = async () => {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    const track = await Audio.Sound.createAsync({
      uri: route.params[currentTrackInPlaylist].previewUrl,
    });

    // track.sound._onPlaybackStatusUpdate = (playbackStatus) =>
    // console.log('playback_status2', playbackStatus);

    setSound(track.sound);
    if (track) {
      await track.sound.playAsync();
    }
  };
  // if (track) {
  //   await track.playAsync();
  // }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // sound._onPlaybackStatusUpdate = (playbackStatus) =>
  //   console.log('playback_status', playbackStatus);
  const pauseTrack = async () => {
    if (sound) await sound.pauseAsync();
  };

  const stopTrack = async () => {
    if (sound) await sound.stopAsync();
  };

  return (
    // <ImageBackground
    //   source={require('../../../assets/images/main_background.png')}
    //   resizeMode="cover"
    //   style={styles.background}
    // >
    <View style={styles.background}>
      <View style={styles.trackCoverContainer}>
        <Text style={styles.trackTitle}>{route.params[currentTrackInPlaylist].artist}</Text>
        <Image
          style={styles.trackCover}
          source={{ height: 300, width: 300, uri: route.params[currentTrackInPlaylist].imageURL }}
        />
        <Text style={styles.trackTitle}>{route.params[currentTrackInPlaylist].title}</Text>
        <Image
          style={styles.playButton}
          source={require('../../../assets/icons/favButton.png')}
        ></Image>
      </View>
      <View style={styles.trackControlContainer}>
        {/* faded version of the button for disabled? */}
        <TouchableOpacity
          onPress={() => {
            if (currentTrackInPlaylist > 0) {
              setCurrentTrackInPlaylist(currentTrackInPlaylist - 1);
              setIsPlaying(false);
              stopTrack();
            } else return;
          }}
        >
          <Image
            style={styles.playButton}
            source={require('../../../assets/icons/prevTrackButton.png')}
          ></Image>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (!isPlaying) {
              playTrack();
              setIsPlaying(true);
            } else {
              pauseTrack();
              setIsPlaying(false);
            }
          }}
        >
          {!isPlaying ? (
            <Image
              style={styles.playButton}
              source={require('../../../assets/icons/playButton.png')}
            ></Image>
          ) : (
            <Image
              style={styles.playButton}
              source={require('../../../assets/icons/pauseTrackButton.png')}
            ></Image>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (currentTrackInPlaylist < amountOfTracksInPlaylist) {
              setCurrentTrackInPlaylist(currentTrackInPlaylist + 1);
              setIsPlaying(false);
              stopTrack();
            } else return;
          }}
        >
          <Image
            style={styles.playButton}
            source={require('../../../assets/icons/nextTrackButton.png')}
          ></Image>
        </TouchableOpacity>
      </View>
    </View>
    // </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  trackCoverContainer: {
    backgroundColor: 'white',
    margin: 5,
  },
  trackCover: {
    alignSelf: 'center',
  },
  trackTitle: {
    fontSize: 40,
    alignSelf: 'center',
    fontFamily: 'AngemeBold',
    margin: 5,
  },
  trackControlContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 60,
    height: 60,
    alignSelf: 'flex-end',
    margin: 15,
  },
});

export default PlayerScreen;
