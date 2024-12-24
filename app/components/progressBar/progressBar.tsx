import usePlayPosition from '@/hooks/usePlayPosition';
import { useTrackChange } from '@/hooks/useTrackChange';
import { PlaybackContext } from '@/app/context/playbackContext';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import { useTheme } from '@react-navigation/native';
import { getStyles } from './styles';

const ProgressBar = () => {
  const [playTimeCurrent, setPlayTimeCurrent] = useState(0);
  const progress = useSharedValue(0);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const { playbackData, setPlaybackData } = useContext(PlaybackContext);
  const { setPlayPosition, setElementWidth, setIsMoving } = usePlayPosition();
  const [trackDuration, setTrackDuration] = useState(0);
  const setTrackIndex = useTrackChange(playbackData.currentTrackNumberInPlaylist || 0);
  const [isDragging, setIsDragging] = useState(false);
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const pan = useMemo(() => {
    return Gesture.Pan()
      .onStart(() => {
        runOnJS(setIsMoving)(true);
        runOnJS(setIsDragging)(true);
        cancelAnimation(progress);
      })
      .onChange((e) => {
        const newProgress = Math.max(0, Math.min(e.absoluteX, progressBarWidth));
        progress.value = newProgress;
      })
      .onEnd(() => {
        runOnJS(setPlayPosition)(progress.value);
        runOnJS(setElementWidth)(progressBarWidth);
        runOnJS(setIsMoving)(false);
        runOnJS(setIsDragging)(false);
      });
  }, [progress, progressBarWidth, setElementWidth, setIsMoving, setPlayPosition]);

  const progressStyle = useAnimatedStyle(() => ({ width: progress.value }));

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value - 10 }],
  }));

  useEffect(() => {
    if (playbackData.currentSound) {
      playbackData.currentSound._onPlaybackStatusUpdate = (playbackStatus) => {
        if (!isDragging && playbackStatus.isLoaded && playbackStatus.durationMillis) {
          const progressConfig = {
            duration: (progress.value =
              playbackStatus.durationMillis - playbackStatus.positionMillis),
            easing: Easing.linear,
          };

          const startAnimation = () => {
            const progressPercent = playbackStatus.durationMillis
              ? playbackStatus.positionMillis / playbackStatus.durationMillis
              : 0;
            progress.value = progressPercent * progressBarWidth;
            progress.value = withTiming(progressBarWidth, progressConfig);
          };

          if (playbackStatus.shouldPlay) {
            startAnimation();
          } else {
            cancelAnimation(progress);
          }
          setPlayTimeCurrent(playbackStatus.positionMillis);
          setTrackDuration(playbackStatus.durationMillis || 0);
        }
        if (
          playbackStatus.isLoaded &&
          playbackStatus.didJustFinish &&
          playbackData.currentPlaylistData &&
          playbackData.currentTrackNumberInPlaylist
        ) {
          if (
            playbackData.currentTrackNumberInPlaylist ===
            playbackData.currentPlaylistData?.length - 1
          ) {
            setPlaybackData({ isPlaying: false });
          } else setTrackIndex(playbackData.currentTrackNumberInPlaylist + 1);
        }
      };
    }
  }, [
    progress,
    playbackData.currentSound,
    progressBarWidth,
    playbackData.currentPlaylistData,
    playbackData.currentTrackNumberInPlaylist,
    isDragging,
    setTrackIndex,
    setPlaybackData,
  ]);

  return (
    <View style={styles.progressBarContainer}>
      <View style={styles.timersContainer}>
        <Text>{`${Math.floor(playTimeCurrent / 1000 / 60)}:${Math.floor((playTimeCurrent / 1000) % 60) < 10 ? '0' : ''}${Math.floor((playTimeCurrent / 1000) % 60)}`}</Text>
        <Text>{`${Math.floor(trackDuration / 1000 / 60)}:${Math.floor((trackDuration / 1000) % 60) < 10 ? '0' : ''}${Math.floor((trackDuration / 1000) % 60)}`}</Text>
      </View>
      <GestureDetector gesture={pan}>
        <View
          style={styles.barContainer}
          onLayout={(e) => {
            const { width } = e.nativeEvent.layout;
            setProgressBarWidth(width);
          }}
        >
          <Animated.View style={[styles.progressFiller, progressStyle]} />
          <Animated.View style={[styles.knob, knobStyle]} />
        </View>
      </GestureDetector>
    </View>
  );
};

export default ProgressBar;
