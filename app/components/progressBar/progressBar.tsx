import usePlayPosition from '@/hooks/usePlayPosition';
import { PlaybackContext } from '@/scripts/playbackContext';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  cancelAnimation,
  ReduceMotion,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

const ProgressBar = () => {
  const [playTimeCurrent, setPlayTimeCurrent] = useState(0);
  const progress = useSharedValue(0);
  const [animationPaused, setAnimationPaused] = useState(false);
  const [animationTemp, setAnimationTemp] = useState<number>();
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const { playbackData } = useContext(PlaybackContext);
  const { setPlayPosition, setElementWidth, setIsMoving } = usePlayPosition();
  const [trackDuration, setTrackDuration] = useState(0);

  const pan = useMemo(() => {
    return Gesture.Pan()
      .onStart(() => {
        runOnJS(setIsMoving)(true);
      })
      .onChange((e) => {
        const newProgress = Math.max(0, Math.min(e.absoluteX, progressBarWidth));
        progress.value = newProgress;
      })
      .onEnd(() => {
        runOnJS(setPlayPosition)(progress.value);
        runOnJS(setElementWidth)(progressBarWidth);
        runOnJS(setIsMoving)(false);
      });
  }, [progress, progressBarWidth, setElementWidth, setIsMoving, setPlayPosition]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${(progress.value / progressBarWidth) * 100}%`,
  }));

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value - 10 }],
  }));

  useEffect(() => {
    if (playbackData.currentSound) {
      playbackData.currentSound._onPlaybackStatusUpdate = (playbackStatus) => {
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
          const testConfig = {
            duration: playbackStatus.durationMillis - playbackStatus.positionMillis,
            dampingRatio: 1,
            stiffness: 0.1,
            overshootClamping: false,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 2,
            reduceMotion: ReduceMotion.System,
          };
          if (playbackStatus.shouldPlay === true) {
            console.log('anim', animationPaused)
            if (animationPaused) {
              console.log('happens')
              progress.value = withTiming(progressBarWidth, testConfig);
              setAnimationPaused(false);
            } else progress.value = withTiming(progressBarWidth, progressConfig);
          }
          setPlayTimeCurrent(playbackStatus.positionMillis);
          setTrackDuration(playbackStatus.durationMillis || 0);
        }
        if (playbackStatus.isLoaded && playbackStatus.shouldPlay === false) {
          setAnimationPaused(true);
          setAnimationTemp(progress.value);
          cancelAnimation(progress);
        }
      };
      // if (
      //   playbackStatus.isLoaded &&
      //   playbackStatus.didJustFinish &&
      //   !(playbackData.currentTrackNumberInPlaylist === amountOfTracksInPlaylist)
      // ) {
      //   setTrackIndex(playbackData.currentTrackNumberInPlaylist + 1);
      // }
    }
  }, [progress, playbackData.currentSound, progressBarWidth]);

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

const styles = StyleSheet.create({
  progressBarContainer: {
    width: '100%',
  },
  barContainer: {
    height: 4,
    backgroundColor: 'grey',
    borderRadius: 2,
    margin: 10,
  },
  progressFiller: {
    height: '100%',
    backgroundColor: 'black',
    borderRadius: 2,
  },
  timersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  knob: {
    position: 'absolute',
    top: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'black',
  },
});

export default ProgressBar;
