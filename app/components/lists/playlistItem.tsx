import { useTheme } from '@react-navigation/native';
import { View, StyleSheet, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Checkbox from 'expo-checkbox';
import { useEffect, useMemo, useState } from 'react';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

type PlaylistItemProps = {
  item: { song: string; artist: string };
  index: number;
  onReorder: (fromIndex: number, toIndex: number) => void;
  itemCount: number;
};

const PlaylistItem = ({ item, index, onReorder, itemCount }: PlaylistItemProps) => {
  const [isChecked, setChecked] = useState(false);
  const { colors } = useTheme();
  const panY = useSharedValue(0);
  const active = useSharedValue(false);
  const initialListItemHeight = 50;
  const [itemHeight, setItemHeight] = useState(initialListItemHeight);

  const pan = useMemo(() => {
    return Gesture.Pan()
      .onStart(() => {
        active.value = true;
      })
      .onUpdate(({ translationY }) => {
        panY.value = translationY;
      })
      .onEnd(() => {
        const dragged = Math.round(panY.value / itemHeight);
        const newIndex = Math.max(0, Math.min(index + dragged));
        if (newIndex !== index) {
          runOnJS(onReorder)(index, newIndex);
        }
        panY.value = withTiming(0);
        console.log('dragged to:', dragged);
        active.value = false;
      });
  }, [active, panY]);

  useEffect(() => {
    console.log('item', itemHeight);
  }, [itemHeight]);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: panY.value }],
    zIndex: active.value ? 1 : 0,
    shadowOpacity: withTiming(active.value ? 1 : 0),
  }));

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 0.5,
      borderBottomColor: colors.border,
      paddingHorizontal: 10,
      height: 50,
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
    <Animated.View style={[styles.container, animatedStyles]}>
      <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked} />
      <View style={styles.trackInfo} onLayout={(e) => setItemHeight(e.nativeEvent.layout.height)}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {item.song}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
      <GestureDetector gesture={pan}>
        <Ionicons name="reorder-three-outline" size={24} color="#fff" />
      </GestureDetector>
    </Animated.View>
  );
};

export default PlaylistItem;
