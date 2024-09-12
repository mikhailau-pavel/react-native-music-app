import { fetchUserTops } from '@/api/api';
import { addTracksToPlaylist, createPlaylist } from '@/api/playlists';
import { getUserData } from '@/api/user';
import { TopsListItem, TopsResponseDataItem } from '@/types/types';
import { useTheme } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View, Image, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const TopsMainScreen = () => {
  const [topsData, setTopsData] = useState<TopsListItem[]>();
  const [type, setType] = useState<'artists' | 'tracks'>('artists');
  const [period, setPeriod] = useState<'short_term' | 'medium_term' | 'long_term'>('short_term');
  const { t } = useTranslation();
  const { colors } = useTheme();

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#121212',
    },
    topItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#282828',
    },
    topItemRank: {
      color: '#b3b3b3',
      fontSize: 16,
      width: 30,
      textAlign: 'center',
    },
    topItemImage: {
      width: 50,
      height: 50,
      marginRight: 15,
    },
    topItemText: {
      color: '#ffffff',
      fontSize: 16,
      flex: 1,
    },
    topsTopBarContainer: {
      backgroundColor: '#121212',
      paddingTop: 20,
      paddingBottom: 10,
    },
    topsTopBarTypeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
    },
    topsTopBarTypeButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
    },
    topsTopBarPeriodContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    topsTopBarPeriodButton: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 15,
    },
    activeTypeButton: {
      backgroundColor: '#1DB954',
    },
    activePeriodButton: {
      backgroundColor: '#535353',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: 'bold',
    },
    topsCreatePlaylistButton: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: colors.background,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      marginBottom: 20,
    },
  });

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
        ListFooterComponent=
          {type === 'tracks' ? <Pressable
            style={({ pressed }) => [
              styles.topsCreatePlaylistButton,
              pressed
                ? { borderColor: '#FFFFFF', borderBottomWidth: 1, backgroundColor: '#767577' }
                : null,
            ]}
            onPressIn={async () => {
              const userId = await getUserData()
              const title = createPlaylistTitle();
              const topsResponseData = await fetchUserTops('tracks', period);
              const trackUrisArray: string[] = [];
              topsResponseData.forEach((elem: TopsResponseDataItem) => {
                if (elem.uri) {
                  trackUrisArray.push(elem.uri);
                }
              });
              const playlistId = await createPlaylist(title, title, userId )
              addTracksToPlaylist(trackUrisArray, playlistId);
            }}
          >
            <Text style={styles.buttonText}>{t('createPlaylist')}</Text>
          </Pressable> : null}
      />
    </View>
  );
};

export default TopsMainScreen;
