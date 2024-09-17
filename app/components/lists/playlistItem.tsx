import { useTheme } from '@react-navigation/native';
import { View, StyleSheet, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Checkbox from 'expo-checkbox';
import { useMemo, useState } from 'react';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const PlaylistItem = ({ item }) => {
  const [isChecked, setChecked] = useState(false);
  const { colors } = useTheme();
  const panY = useSharedValue(0);
  const active = useSharedValue(false);

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

        // const threshold = screenHeight - screenHeight / 6;
        // if (e.absoluteY > threshold) {
        //   panY.value = withTiming(screenHeight);
        //   // runOnJS(navigation.goBack)();
        //   // runOnJS(setPlaybackData)({ isShowing: true });
        // } else {
        //   panY.value = withTiming(0);
        // }
      });
  }, [active, panY]);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: panY.value }],
  }));

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 0.5,
      borderBottomColor: colors.border,
    },
    playingItemAlbumImage: {
      width: 50,
      height: 50,
      marginRight: 10,
      borderRadius: 5,
    },
    trackInfo: {
      flexDirection: 'row',
    },
    trackTitle: {
      color: colors.text,
      fontSize: 16,
      fontFamily: 'AngemeBold',
    },
    trackArtist: {
      color: colors.text,
      fontSize: 14,
      fontFamily: 'AngemeRegular',
    },
    checkbox: {
      margin: 8,
    },
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.container, animatedStyles]}>
        <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked} />
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {item.song}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {item.artist}
          </Text>
        </View>
        <Ionicons name="reorder-three-outline" size={24} color="#fff" />
      </Animated.View>
    </GestureDetector>
  );
};

export default PlaylistItem;
