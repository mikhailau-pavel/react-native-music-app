import usePlayPosition from '@/hooks/usePlayPosition';
import { PlaybackContext } from '@/scripts/playbackContext';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Text, Touchable } from 'react-native';
import { Gesture, GestureDetector, TouchableOpacity } from 'react-native-gesture-handler';
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
  const panX = useSharedValue(0);
  const offset = useSharedValue(0);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const { playbackData } = useContext(PlaybackContext);
  const [isTrackPaused, setIsTrackPaused] = useState(false);
  const { setPlayPosition, setElementWidth, setIsMoving } = usePlayPosition();

  const pan = useMemo(() => {
    return Gesture.Pan()
      .onStart(() => {
        runOnJS(setIsMoving)(true);
        offset.value = panX.value;
      })
      .onChange((e) => {
        panX.value = offset.value + e.translationX;
      })
      .onEnd(() => {
        runOnJS(setPlayPosition)(panX.value);
        runOnJS(setElementWidth)(progressBarWidth);
        runOnJS(setIsMoving)(false);
      });
  }, [offset, panX, progressBarWidth, setElementWidth, setIsMoving, setPlayPosition]);

  const knobProgressStyle = useAnimatedStyle(() => {
    return { transform: [{ translateX: panX.value }] };
  });

  const progressFiller = useAnimatedStyle(() => {
    //change magic
    return { width: panX.value + 10 };
  });
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
          if (playbackStatus.shouldPlay === true) {
            panX.value = withTiming(progressBarWidth, progressConfig);
          }
          setPlayTimeCurrent(playbackStatus.positionMillis);
          console.log('first load should play status:', panX.value);
        }
        if (playbackStatus.isLoaded && playbackStatus.shouldPlay === false) {
          cancelAnimation(panX);
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
  }, [panX, playbackData.currentSound, progressBarWidth]);

  return (
    <View style={styles.progressBarContainer}>
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
        <TouchableOpacity style={styles.knobContainer}>
          <GestureDetector gesture={pan}>
            <Animated.View style={[styles.knob, progressFiller]}>
              <Text>Pull</Text>
            </Animated.View>
          </GestureDetector>
          <Animated.View style={[styles.bar, knobProgressStyle]} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {},
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
  timersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  knobContainer: {
    flexDirection: 'row',
  },
  knob: {
    width: 50,
    backgroundColor: 'yellow',
    borderRadius: 25,
  },
});

export default ProgressBar;
