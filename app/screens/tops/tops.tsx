import { fetchUserTops } from '@/api/api';
import { addTracksToPlaylist, createPlaylist } from '@/api/playlists';
import { getUserData } from '@/api/user';
import { TopsListItem, TopsResponseDataItem } from '@/types/types';
import { useTheme } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View, Image, Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { getStyles } from './styles';

const TopsMainScreen = () => {
  const [topsData, setTopsData] = useState<TopsListItem[]>();
  const [type, setType] = useState<'artists' | 'tracks'>('artists');
  const [period, setPeriod] = useState<'short_term' | 'medium_term' | 'long_term'>('short_term');
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const ItemOfTop = ({ item, index }: { item: TopsListItem; index: number }) => {
    return (
      <View style={styles.topItemContainer}>
        <Text style={styles.topItemRank}>{index + 1}</Text>
        <Image style={styles.topItemImage} source={{ uri: item.imageUrl }} />
        <Text style={styles.topItemText}>{item.title}</Text>
      </View>
    );
  };

  const createPlaylistTitle = () => {
    const playlistTitlePeriod = () => {
      switch (period) {
        case 'short_term':
          return 'last month';
        case 'medium_term':
          return 'last 6 months';
        case 'long_term':
          return 'all time';
      }
    };

    return `Top tracks of ${playlistTitlePeriod()}`;
  };

  useEffect(() => {
    const fetchTop = async () => {
      const topsResponseData = await fetchUserTops(type, period);
      const topsDataToRender = topsResponseData.map((item: TopsResponseDataItem, index: number) => {
        return {
          title: item.name,
          imageUrl: type === 'artists' ? item.images[0].url : item.album.images[0].url,
        };
      });
      setTopsData(topsDataToRender);
    };
    fetchTop();
  }, [type, period]);

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={topsData}
        renderItem={ItemOfTop}
        entering={FadeIn.duration(2000)}
        ListHeaderComponent={
          <View style={styles.topsTopBarContainer}>
            <View style={styles.topsTopBarTypeContainer}>
              <Pressable
                style={[
                  styles.topsTopBarTypeButton,
                  type === 'artists' ? styles.activeTypeButton : null,
                ]}
                onPressIn={() => {
                  setType('artists');
                }}
              >
                <Text style={styles.buttonText}>Artists</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.topsTopBarTypeButton,
                  type === 'tracks' ? styles.activeTypeButton : null,
                ]}
                onPressIn={() => {
                  setType('tracks');
                }}
              >
                <Text style={styles.buttonText}>Tracks</Text>
              </Pressable>
            </View>
            <View style={styles.topsTopBarPeriodContainer}>
              <Pressable
                style={[
                  styles.topsTopBarPeriodButton,
                  period === 'short_term' ? styles.activePeriodButton : null,
                ]}
                onPressIn={() => {
                  setPeriod('short_term');
                }}
              >
                <Text style={styles.buttonText}>4 weeks</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.topsTopBarPeriodButton,
                  period === 'medium_term' ? styles.activePeriodButton : null,
                ]}
                onPressIn={() => {
                  setPeriod('medium_term');
                }}
              >
                <Text style={styles.buttonText}>6 months</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.topsTopBarPeriodButton,
                  period === 'long_term' ? styles.activePeriodButton : null,
                ]}
                onPressIn={() => {
                  setPeriod('long_term');
                }}
              >
                <Text style={styles.buttonText}>All time</Text>
              </Pressable>
            </View>
          </View>
        }
        ListFooterComponent={
          type === 'tracks' ? (
            <Pressable
              style={({ pressed }) => [
                styles.topsCreatePlaylistButton,
                pressed
                  ? { borderColor: '#FFFFFF', borderBottomWidth: 1, backgroundColor: '#767577' }
                  : null,
              ]}
              onPressIn={async () => {
                const userId = await getUserData();
                const title = createPlaylistTitle();
                const topsResponseData = await fetchUserTops('tracks', period);
                const trackUrisArray: string[] = [];
                topsResponseData.forEach((elem: TopsResponseDataItem) => {
                  if (elem.uri) {
                    trackUrisArray.push(elem.uri);
                  }
                });
                const playlistId = await createPlaylist(title, title, userId);
                addTracksToPlaylist(trackUrisArray, playlistId);
              }}
            >
              <Text style={styles.buttonText}>{t('createPlaylist')}</Text>
            </Pressable>
          ) : null
        }
      />
    </View>
  );
};

export default TopsMainScreen;
