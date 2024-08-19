import { PlayerScreenProps } from '@/types/types';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Image, StyleSheet, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';

const PlayerScreen = ({ route, navigation }: PlayerScreenProps) => {
  const [sound, setSound] = useState<Sound>();
  const [currentTrackInPlaylist, setCurrentTrackInPlaylist] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const [playTimeCurrent, setPlayTimeCurrent] = useState(0);
  const [playTimeTotal, setPlayTimeTotal] = useState(0);
  const progress = new Animated.Value(0);
  // testProgress.setValue(10);
  // console.log('test progress', testProgress);

  const playlistInfoArr = route.params;
  const amountOfTracksInPlaylist = playlistInfoArr.length - 1;

  const playTrack = async () => {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    const track = await Audio.Sound.createAsync({
      uri: route.params[currentTrackInPlaylist].previewUrl,
    });

    setSound(track.sound);
    if (track) {
      await track.sound.playAsync();
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  if (sound) {
    sound._onPlaybackStatusUpdate = (playbackStatus) => {
      if (playbackStatus.isLoaded && playbackStatus.isPlaying && playbackStatus.durationMillis) {
        const currentTrackProgress = playbackStatus.positionMillis / playbackStatus.durationMillis;
        console.log('currentTrackProgress', currentTrackProgress);
        progress.setValue(currentTrackProgress);
        console.log('current progress', currentTrackProgress * 100);
        setPlayTimeTotal(playbackStatus.durationMillis);
        setPlayTimeCurrent(playbackStatus.positionMillis);
        setPlayProgress(currentTrackProgress)
        Animated.timing(progress, {
          useNativeDriver: false,
          toValue: currentTrackProgress * 100,
          duration: 2000,
        }).start();
      }
    };
  }

  const pauseTrack = async () => {
    if (sound) await sound.pauseAsync();
  };

  const stopTrack = async () => {
    if (sound) await sound.stopAsync();
  };

  useEffect(() => {
    console.log('progress', progress);
    // Animated.timing(progress, {
    //   useNativeDriver: false,
    //   toValue: playTimeTotal,
    //   //duration: 2000,
    // }).start();
  }, [playTimeTotal, progress]);

  return (
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
        <Text>{playTimeCurrent}</Text>
        <View style={styles.barContainer}>
          <Animated.View style={[styles.bar, { width: `${(playProgress * 100)}%` }]} />
        </View>
      </View>
      <View style={styles.trackControlContainer}>
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
  barContainer: {
    height: 20,
    backgroundColor: 'grey',
    borderRadius: 10,
    margin: 10,
  },
  bar: {
    height: 20,
    backgroundColor: 'black',
    borderRadius: 10,
  },
});

export default PlayerScreen;
