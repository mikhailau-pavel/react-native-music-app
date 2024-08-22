import { PlayerScreenProps } from '@/types/types';
import { useEffect, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  ScrollView,
  LayoutAnimation,
} from 'react-native';
import Animated, { ReduceMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';

const PlayerScreen = ({ route }: PlayerScreenProps) => {
  const [sound, setSound] = useState<Sound | null>(null);
  const [currentTrackInPlaylist, setCurrentTrackInPlaylist] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playTimeCurrent, setPlayTimeCurrent] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const progress = useSharedValue(0);
  const playlistInfoArr = route.params;
  const amountOfTracksInPlaylist = playlistInfoArr.length - 1;

  const createPlayback = async (url: string) => {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    const track = await Audio.Sound.createAsync({ uri: url });
    setSound(track.sound);
    return track.sound;
  };

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setExpanded(!expanded);
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    if (sound) {
      sound._onPlaybackStatusUpdate = (playbackStatus) => {
        if (playbackStatus.isLoaded && playbackStatus.isPlaying && playbackStatus.durationMillis) {
          const progressConfig = {
            duration: playbackStatus.durationMillis,
            dampingRatio: 1,
            stiffness: 0.1,
            overshootClamping: false,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 2,
            reduceMotion: ReduceMotion.System,
          };
          progress.value = withTiming(progressBarWidth, progressConfig);
          setPlayTimeCurrent(playbackStatus.positionMillis);
        }
        if (
          playbackStatus.isLoaded &&
          playbackStatus.didJustFinish &&
          !(currentTrackInPlaylist === amountOfTracksInPlaylist)
        ) {
          playNextTrack();
        }
      };
    }
  }, [sound]);

  const playTrack = async () => {
    if (sound) {
      setIsPlaying(true);
      await sound.playAsync();
    }
  };

  const playNextTrack = async () => {
    await stopTrack();
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
    setCurrentTrackInPlaylist(currentTrackInPlaylist + 1);
    const nextTrackUrl = route.params[currentTrackInPlaylist + 1].previewUrl;
    const nextSound = await createPlayback(nextTrackUrl);
    await nextSound.playAsync();
    progress.value = 0;
    setIsPlaying(true);
  };

  const playPreviousTrack = async () => {
    await stopTrack();
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
    setCurrentTrackInPlaylist(currentTrackInPlaylist - 1);
    const prevTrackUrl = route.params[currentTrackInPlaylist - 1].previewUrl;
    const prevSound = await createPlayback(prevTrackUrl);
    await prevSound.playAsync();
    setIsPlaying(true);
    progress.value = 0;
  };

  const pauseTrack = async () => {
    if (sound) await sound.pauseAsync();
    setIsPlaying(false);
  };

  const stopTrack = async () => {
    if (sound) await sound.stopAsync();
  };

  const handlePlayButtonPress = async () => {
    if (!isPlaying) {
      if (!sound) {
        const url = route.params[currentTrackInPlaylist].previewUrl;
        const newTrack = await createPlayback(url);
        await newTrack.playAsync();
      } else {
        await playTrack();
      }
      setIsPlaying(true);
    } else {
      await pauseTrack();
      setIsPlaying(false);
    }
  };

  return (
    //scale track cover on Android depending on controls availability?
    <ScrollView style={styles.background}>
      <View style={styles.trackCoverContainer}>
        <Text style={styles.trackTitle}>{route.params[currentTrackInPlaylist].artist}</Text>
        <Image
          style={styles.trackCover}
          source={{ height: 300, width: 300, uri: route.params[currentTrackInPlaylist].imageURL }}
        />
        <Text style={styles.trackTitle}>{route.params[currentTrackInPlaylist].title}</Text>
        {!expanded ? (
          <View style={styles.trackInfoControlContainer}>
            <TouchableOpacity>
              <Image
                style={styles.controlButton}
                source={require('../../../assets/icons/favButton.png')}
              ></Image>
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                style={styles.controlButton}
                source={require('../../../assets/icons/loopButton.png')}
              ></Image>
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                style={styles.controlButton}
                source={require('../../../assets/icons/muteButton.png')}
              ></Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePress}>
              <Image
                style={styles.controlButton}
                source={require('../../../assets/icons/closeButton.png')}
              ></Image>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={handlePress}>
            <Image
              style={styles.controlButton}
              source={require('../../../assets/icons/infoButton.png')}
            ></Image>
          </TouchableOpacity>
        )}
        <View style={styles.timersContainer}>
          <Text>{`${Math.floor(playTimeCurrent / 1000 / 60)}:${Math.floor((playTimeCurrent / 1000) % 60) < 10 ? '0' : ''}${Math.floor((playTimeCurrent / 1000) % 60)}`}</Text>
          <Text>0:29</Text>
        </View>
        <View
          style={styles.barContainer}
          onLayout={(e) => {
            const { width } = e.nativeEvent.layout;
            setProgressBarWidth(width);
          }}
        >
          <Animated.View style={[styles.bar, { width: progress }]} />
          {/* `${playProgress * 100}%` */}
        </View>
      </View>
      <View style={styles.trackControlContainer}>
        {!(currentTrackInPlaylist === 0) ? (
          <TouchableOpacity
            onPress={() => {
              if (currentTrackInPlaylist > 0) {
                playPreviousTrack();
              } else return;
            }}
          >
            <Image
              style={[styles.controlButton]}
              source={require('../../../assets/icons/prevTrackButton.png')}
            ></Image>
          </TouchableOpacity>
        ) : (
          <Image
            style={[styles.controlButton, { opacity: 0.3 }]}
            source={require('../../../assets/icons/prevTrackButton.png')}
          ></Image>
        )}
        <TouchableOpacity onPress={handlePlayButtonPress}>
          {!isPlaying ? (
            <Image
              style={styles.controlButton}
              source={require('../../../assets/icons/playButton.png')}
            ></Image>
          ) : (
            <Image
              style={styles.controlButton}
              source={require('../../../assets/icons/pauseTrackButton.png')}
            ></Image>
          )}
        </TouchableOpacity>
        {!(currentTrackInPlaylist === amountOfTracksInPlaylist) ? (
          <TouchableOpacity
            onPress={() => {
              if (currentTrackInPlaylist < amountOfTracksInPlaylist) {
                playNextTrack();
              } else return;
            }}
          >
            <Image
              style={styles.controlButton}
              source={require('../../../assets/icons/nextTrackButton.png')}
            ></Image>
          </TouchableOpacity>
        ) : (
          <Image
            style={[styles.controlButton, { opacity: 0.3 }]}
            source={require('../../../assets/icons/nextTrackButton.png')}
          ></Image>
        )}
      </View>
    </ScrollView>
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
  timersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  trackInfoControlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  trackControlContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButton: {
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
    overflow: 'hidden',
  },
  bar: {
    height: 20,
    backgroundColor: 'black',
    borderRadius: 10,
  },
});

export default PlayerScreen;
