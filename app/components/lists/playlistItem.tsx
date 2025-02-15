import { useTheme } from '@react-navigation/native';
import { View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Checkbox from 'expo-checkbox';
import { useMemo, useState } from 'react';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { getStyles } from './styles';

type PlaylistItemProps = {
  item: { title: string; artist: string };
  index: number;
  onReorder: (fromIndex: number, toIndex: number) => void;
  itemCount: number;
};

const PlaylistItem = ({ item, index, onReorder }: PlaylistItemProps) => {
  const [isChecked, setChecked] = useState(false);
  const { colors } = useTheme();
  const panY = useSharedValue(0);
  const active = useSharedValue(false);
  const initialListItemHeight = 50;
  const [itemHeight] = useState(initialListItemHeight);
  const styles = getStyles(colors);

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
        active.value = false;
      });
  }, [active, index, itemHeight, panY]);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: panY.value }],
    position: 'relative',
    left: 0,
    zIndex: active.value ? 1 : 0,
    shadowOpacity: withTiming(active.value ? 1 : 0),
  }));

  return (
    <Animated.View style={[styles.container, animatedStyles]}>
      <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked} />
      <GestureDetector gesture={pan}>
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {item.artist}
          </Text>
        </View>
      </GestureDetector>
      <Ionicons name="reorder-three-outline" size={24} color="#fff" />
    </Animated.View>
  );
};

export default PlaylistItem;
