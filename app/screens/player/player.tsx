import { PlayerScreenProps } from '@/types/types';
import { useContext, useEffect, useMemo, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  LayoutAnimation,
  Dimensions,
} from 'react-native';
import Animated, {
  ReduceMotion,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { PlaybackContext } from '@/scripts/playbackContext';

const PlayerScreen = ({ navigation }: PlayerScreenProps) => {
  const active = useSharedValue(false);
  const panY = useSharedValue(0);
  const screenHeight = Dimensions.get('screen').height;
  const { playbackData, setPlaybackData } = useContext(PlaybackContext);

  const pan = useMemo(() => {
    return Gesture.Pan()
      .onStart(() => {
        active.value = true;
      })
      .onUpdate(({ translationY }) => {
        panY.value = translationY;
      })
      .onEnd((e) => {
        active.value = false;

        const threshold = screenHeight - screenHeight / 6;
        if (e.absoluteY > threshold) {
          panY.value = withTiming(screenHeight);
          runOnJS(navigation.goBack)();
        } else {
          panY.value = withTiming(0);
        }
      });
  }, [active, navigation.goBack, panY, screenHeight]);

  const animatedStyles = useAnimatedStyle(() => ({
    flex: 1,
    transform: [{ translateY: panY.value }],
  }));
  const [sound, setSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playTimeCurrent, setPlayTimeCurrent] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const progress = useSharedValue(0);
  const amountOfTracksInPlaylist = playbackData.currentPlaylistData.length - 1;

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

  // useEffect(() => {
  //   return sound
  //     ? () => {
  //         sound.unloadAsync();
  //       }
  //     : undefined;
  // }, [sound]);

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
          !(playbackData.currentTrackNumberInPlaylist === amountOfTracksInPlaylist)
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
    setPlaybackData({
      ...playbackData,
      currentTrackNumberInPlaylist: playbackData.currentTrackNumberInPlaylist + 1,
    });
    const nextTrackUrl = playbackData.currentPlaylistData[playbackData.currentTrackNumberInPlaylist + 1].previewUrl;
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
    setPlaybackData({
      ...playbackData,
      currentTrackNumberInPlaylist: playbackData.currentTrackNumberInPlaylist - 1,
    });
    const prevTrackUrl = playbackData.currentPlaylistData[playbackData.currentTrackNumberInPlaylist - 1].previewUrl;
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
        const url = playbackData.currentPlaylistData[playbackData.currentTrackNumberInPlaylist].previewUrl;
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
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.background, animatedStyles]}>
        <View style={styles.trackCoverContainer}>
          <Text style={styles.trackTitle}>
            {playbackData.currentPlaylistData[playbackData.currentTrackNumberInPlaylist].artist}
          </Text>
          <Image
            style={styles.trackCover}
            source={{
              height: 300,
              width: 300,
              uri: playbackData.currentPlaylistData[playbackData.currentTrackNumberInPlaylist].imageURL,
            }}
          />
          <Text style={styles.trackTitle}>
            {playbackData.currentPlaylistData[playbackData.currentTrackNumberInPlaylist].title}
          </Text>
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
          </View>
        </View>
        <View style={styles.trackControlContainer}>
          {!(playbackData.currentTrackNumberInPlaylist === 0) ? (
            <TouchableOpacity
              onPress={() => {
                if (playbackData.currentTrackNumberInPlaylist > 0) {
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
          {!(playbackData.currentTrackNumberInPlaylist === amountOfTracksInPlaylist) ? (
            <TouchableOpacity
              onPress={() => {
                if (playbackData.currentTrackNumberInPlaylist < amountOfTracksInPlaylist) {
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
      </Animated.View>
    </GestureDetector>
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
