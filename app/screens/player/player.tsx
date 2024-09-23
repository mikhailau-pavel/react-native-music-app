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
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { PlaybackContext } from '@/app/context/playbackContext';
import { pauseTrack, playTrack } from '@/scripts/player';
import { useTrackChange } from '@/hooks/useTrackChange';
import ProgressBar from '@/app/components/progressBar/progressBar';
import { useTheme } from '@react-navigation/native';
import { getTrackInfo } from '@/api/tracks';

const PlayerScreen = ({ navigation }: PlayerScreenProps) => {
  const active = useSharedValue(false);
  const panY = useSharedValue(0);
  const screenHeight = Dimensions.get('screen').height;
  const { playbackData, setPlaybackData } = useContext(PlaybackContext);
  const setTrackIndex = useTrackChange(playbackData.currentTrackNumberInPlaylist || 0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const { colors } = useTheme();

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
          runOnJS(setPlaybackData)({ isShowing: true });
        } else {
          panY.value = withTiming(0);
        }
      });
  }, [active, panY, screenHeight, navigation.goBack, setPlaybackData]);

  const animatedStyles = useAnimatedStyle(() => ({
    flex: 1,
    transform: [{ translateY: panY.value }],
  }));
  const [expanded, setExpanded] = useState(true);
  const amountOfTracksInPlaylist = playbackData.currentPlaylistData
    ? playbackData.currentPlaylistData.length - 1
    : 0;

  const handleInfoButtonPress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setExpanded(!expanded);
  };

  const handleSongTitlePress = async () => {
    if (playbackData.currentPlaylistData) {
      const trackId =
        playbackData.currentPlaylistData[playbackData.currentTrackNumberInPlaylist || 0].trackId;
      const trackInfo = await getTrackInfo(trackId);
      const albumId = trackInfo.album.id;
      const albumImage = trackInfo.album.images[0].url;
      const albumName = trackInfo.album.name;
      navigation.navigate('Playlist', {
        playlistId: albumId,
        playlistCover: albumImage,
        playlistTitle: albumName,
        type: 'album',
      });
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

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (playbackData.currentArtist) {
        setPlaybackData({ isShowing: true });
      }
    });
    return unsubscribe;
  }, [navigation, playbackData, setPlaybackData]);

  const handleNextTrackButtonPress = (direction: 'next' | 'previous') => {
    const currentNumber = playbackData.currentTrackNumberInPlaylist;
    if (currentNumber === 0 || currentNumber) {
      if (currentNumber < amountOfTracksInPlaylist && direction === 'next') {
        setTrackIndex(currentNumber + 1);
      } else if (currentNumber > 0 && direction === 'previous') {
        setTrackIndex(currentNumber - 1);
      } else return;
    }
  };

  const handleMuteButtonPress = async () => {
    if (playbackData.currentSound) {
      const playbackStatus = await playbackData.currentSound.getStatusAsync();
      if (playbackStatus.isLoaded) {
        playbackData.currentSound?.setIsMutedAsync(!playbackStatus.isMuted);
        setIsMuted(!isMuted);
      }
    }
  };

  const handleLoopButtonPress = async () => {
    if (playbackData.currentSound) {
      const playbackStatus = await playbackData.currentSound.getStatusAsync();
      if (playbackStatus.isLoaded) {
        playbackData.currentSound?.setIsLoopingAsync(!playbackStatus.isLooping);
        setIsLooping(!isLooping);
      }
    }
  };

  const styles = StyleSheet.create({
    background: {
      flex: 1,
    },
    trackCoverGradient: {
      position: 'absolute',
      height: 600,
      left: 0,
      right: 0,
      top: 0,
    },
    trackCoverContainer: {
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
      color: colors.text,
    },
    trackInfoControlContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignContent: 'center',
    },
    trackControlContainer: {
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
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.background, animatedStyles]}>
        <View style={styles.trackCoverContainer}>
          {playbackData.currentPlaylistData && (
            <>
              <Text style={styles.trackTitle}>
                {
                  playbackData.currentPlaylistData[playbackData.currentTrackNumberInPlaylist || 0]
                    .artist
                }
              </Text>
              <Image
                style={styles.trackCover}
                source={{
                  height: 300,
                  width: 300,
                  uri: playbackData.currentPlaylistData[
                    playbackData.currentTrackNumberInPlaylist || 0
                  ].imageURL,
                }}
              />
              <TouchableOpacity onPress={handleSongTitlePress}>
                <Text style={styles.trackTitle}>
                  {
                    playbackData.currentPlaylistData[playbackData.currentTrackNumberInPlaylist || 0]
                      .title
                  }
                </Text>
              </TouchableOpacity>
            </>
          )}
          {!expanded ? (
            <View style={styles.trackInfoControlContainer}>
              <TouchableOpacity>
                <Image
                  style={styles.controlButton}
                  source={require('../../../assets/icons/favButton.png')}
                ></Image>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLoopButtonPress}>
                {isLooping ? (
                  <Image
                    style={styles.controlButton}
                    source={require('../../../assets/icons/loopingButton.png')}
                  ></Image>
                ) : (
                  <Image
                    style={styles.controlButton}
                    source={require('../../../assets/icons/loopButton.png')}
                  ></Image>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={handleMuteButtonPress}>
                {isMuted ? (
                  <Image
                    style={styles.controlButton}
                    source={require('../../../assets/icons/mutedButton.png')}
                  ></Image>
                ) : (
                  <Image
                    style={styles.controlButton}
                    source={require('../../../assets/icons/muteButton.png')}
                  ></Image>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={handleInfoButtonPress}>
                <Image
                  style={styles.controlButton}
                  source={require('../../../assets/icons/closeButton.png')}
                ></Image>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={handleInfoButtonPress}>
              <Image
                style={styles.controlButton}
                source={require('../../../assets/icons/infoButton.png')}
              ></Image>
            </TouchableOpacity>
          )}
          <ProgressBar />
        </View>
        <View style={styles.trackControlContainer}>
          {!(playbackData.currentTrackNumberInPlaylist === 0) ? (
            <TouchableOpacity onPress={() => handleNextTrackButtonPress('previous')}>
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
            <TouchableOpacity onPress={() => handleNextTrackButtonPress('next')}>
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

export default PlayerScreen;
