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
import { Sound } from 'expo-av/build/Audio';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { PlaybackContext } from '@/scripts/playbackContext';
import { createPlayback, pauseTrack, playTrack, stopTrack, unloadSound } from '@/scripts/player';
import { Audio } from 'expo-av';

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
  const [playTimeCurrent, setPlayTimeCurrent] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const progress = useSharedValue(0);
  const amountOfTracksInPlaylist = playbackData.currentPlaylistData.length - 1;

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setExpanded(!expanded);
  };

  // useEffect(() => {
  //   if (sound) {
  //     sound._onPlaybackStatusUpdate = (playbackStatus) => {
  //       if (playbackStatus.isLoaded && playbackStatus.isPlaying && playbackStatus.durationMillis) {
  //         const progressConfig = {
  //           duration: playbackStatus.durationMillis,
  //           dampingRatio: 1,
  //           stiffness: 0.1,
  //           overshootClamping: false,
  //           restDisplacementThreshold: 0.01,
  //           restSpeedThreshold: 2,
  //           reduceMotion: ReduceMotion.System,
  //         };
  //         progress.value = withTiming(progressBarWidth, progressConfig);
  //         setPlayTimeCurrent(playbackStatus.positionMillis);
  //       }
  //       if (
  //         playbackStatus.isLoaded &&
  //         playbackStatus.didJustFinish &&
  //         !(playbackData.currentTrackNumberInPlaylist === amountOfTracksInPlaylist)
  //       ) {
  //         playNextTrack();
  //       }
  //     };
  //   }
  // }, [sound]);

  const playNextTrack = async () => {
    if (playbackData.currentSound) {
      await stopTrack(playbackData.currentSound);
      await unloadSound(playbackData.currentSound);
      await setPlaybackData({ ...playbackData, currentSound: null });
      const nextTrackUrl =
        playbackData.currentPlaylistData[playbackData.currentTrackNumberInPlaylist + 1].previewUrl;
      const newSound = await createPlayback(nextTrackUrl);
      await setPlaybackData({
        ...playbackData,
        currentSound: newSound,
        currentTrackNumberInPlaylist: playbackData.currentTrackNumberInPlaylist + 1,
        isPlaying: true
      });
      progress.value = 0;
      playTrack(newSound);
    }
  };

  const playPreviousTrack = async () => {
    if (playbackData.currentSound) {
      await stopTrack(playbackData.currentSound);
      await unloadSound(playbackData.currentSound);
      await setPlaybackData({ ...playbackData, currentSound: null });
      const nextTrackUrl =
        playbackData.currentPlaylistData[playbackData.currentTrackNumberInPlaylist - 1].previewUrl;
      const newSound = await createPlayback(nextTrackUrl);
      await setPlaybackData({
        ...playbackData,
        currentSound: newSound,
        currentTrackNumberInPlaylist: playbackData.currentTrackNumberInPlaylist - 1,
        isPlaying: true
      });
      progress.value = 0;
      playTrack(newSound);
    }
  };

  const handlePlayButtonPress = async () => {
    if (!playbackData.isPlaying && playbackData.currentSound) {
      await playTrack(playbackData.currentSound);
      setPlaybackData({ ...playbackData, isPlaying: true });
    } else {
      if (playbackData.currentSound) {
        await pauseTrack(playbackData.currentSound);
      }
      setPlaybackData({ ...playbackData, isPlaying: false });
    }
  };

  return (
    //scale track cover on Android depending on controls availability?
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.background, animatedStyles]}>
        <View style={styles.trackCoverContainer}>
          {/* <Text>{JSON.stringify(playbackData.currentSound)}</Text> */}
          <Text style={styles.trackTitle}>
            {playbackData.currentPlaylistData[playbackData.currentTrackNumberInPlaylist].artist}
          </Text>
          <Image
            style={styles.trackCover}
            source={{
              height: 300,
              width: 300,
              uri: playbackData.currentPlaylistData[playbackData.currentTrackNumberInPlaylist]
                .imageURL,
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
            {!playbackData.isPlaying ? (
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
                if (
                  playbackData.currentTrackNumberInPlaylist < amountOfTracksInPlaylist &&
                  playbackData.currentSound
                ) {
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
