import { ActivityItemProps } from '@/utils/constants';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolateColor,
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

const LoadingIndicator = () => {
  const ActivityItem = ({ rotate, delay }: { rotate: string; delay: number }) => {
    const backgroundColor = useSharedValue(0);

    const animatedColors = useDerivedValue(() => {
      return interpolateColor(backgroundColor.value, [0, 1], ['#c4f4ec', '#3bdbc0']);
    });

    const animatedStyles = useAnimatedStyle(() => {
      return {
        backgroundColor: animatedColors.value,
      };
    });

    useEffect(() => {
      backgroundColor.value = withDelay(
        delay,
        withRepeat(withTiming(1, { duration: 1000, easing: Easing.linear }), -1, true)
      );
    }, [backgroundColor, delay]);

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        position: 'absolute',
        width: 10,
        height: 30,
        margin: 5,
        borderRadius: 4,
        backgroundColor: '#fff',
      },
      position: {
        transform: [{ rotate: rotate }, { translateY: -30 }],
      },
    });

    return <Animated.View style={[styles.container, styles.position, animatedStyles]} />;
  };

  return (
    <View style={styles.container}>
      {ActivityItemProps.map((item, index) => (
        <ActivityItem rotate={item.rotate} delay={item.delay} key={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingIndicator;
