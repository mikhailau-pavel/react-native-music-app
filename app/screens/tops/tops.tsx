import { fetchUserTops } from '@/api/api';
import { topsListItem, topsResponseDataItem } from '@/types/types';
import { useEffect, useState } from 'react';
import { Button, Text, View, Image, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const TopsMainScreen = () => {
  //TODO temp state, memoize it because tops update
  const [topsData, setTopsData] = useState<topsListItem[]>();
  const [type, setType] = useState<'artists' | 'tracks'>('artists');
  const [period, setPeriod] = useState<'short_term' | 'medium_term' | 'long_term'>('short_term');

  useEffect(() => {
    const fetchTop = async () => {
      const topsResponseData = await fetchUserTops(type, period);
      const topsDataToRender = topsResponseData.map((item: topsResponseDataItem, index: number) => {
        return {
          title: item.name,
          imageUrl: type === 'artists' ? item.images[0].url : item.album.images[0].url,
        };
      });
      setTopsData(topsDataToRender);
    };
    fetchTop();
  }, [type, period]);

  const itemOfTop = ({ item, index }: { item: topsListItem; index: number }) => {
    return (
      <Animated.View entering={FadeIn.duration(1000)} style={styles.topItemContainer}>
        <Text>{index + 1}</Text>
        <Image style={styles.topItemImage} source={{ uri: item.imageUrl }} />
        <Text style={styles.topItemText}>{item.title}</Text>
      </Animated.View>
    );
  };

  return (
    <Animated.FlatList
      data={topsData}
      renderItem={itemOfTop}
      entering={FadeIn.duration(2000)}
      ListHeaderComponent={
        <View style={styles.topsTopBarContainer}>
          <View style={styles.topsTopBarPeriodContainer}>
            <Pressable
              style={styles.topsTopBarTypeButton}
              onPressIn={() => {
                setType('artists');
              }}
            >
              <Text>Artists</Text>
            </Pressable>
            <Pressable
              style={styles.topsTopBarTypeButton}
              onPressIn={() => {
                setType('tracks');
              }}
            >
              <Text>Tracks</Text>
            </Pressable>
          </View>
          <View style={styles.topsTopBarPeriodContainer}>
            <Pressable
              style={styles.topsTopBarPeriodButton}
              onPressIn={() => {
                setPeriod('short_term');
              }}
            >
              <Text>Last 4 weeks</Text>
            </Pressable>
            <Pressable
              style={styles.topsTopBarPeriodButton}
              onPressIn={() => {
                setPeriod('medium_term');
              }}
            >
              <Text>Last 6 months</Text>
            </Pressable>
            <Pressable
              style={styles.topsTopBarPeriodButton}
              onPressIn={() => {
                setPeriod('long_term');
              }}
            >
              <Text>Last year</Text>
            </Pressable>
          </View>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  topItemContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 200,
  },
  topItemImage: {
    flex: 1,
    width: 100,
    height: 100,
  },
  topItemText: {
    flex: 1,
  },
  topsTopBarContainer: {
    flex: 1,
  },
  topsTopBarTypeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topsTopBarTypeButton: {
    flex: 1,
  },
  topsTopBarPeriodContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topsTopBarPeriodButton: {
    flex: 1,
    borderBottomWidth: 1,
    alignSelf: 'center',
    borderBottomColor: 'yellow',
  },
});

export default TopsMainScreen;
