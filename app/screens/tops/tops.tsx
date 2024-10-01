import { fetchUserTops } from '@/api/api';
import { TopsChartType, TopsListItem, TopsPeriod, TopsResponseDataItem } from '@/types/types';
import { useTheme } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Text, View, Image } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { getStyles } from './styles';
import { TopsFooter } from './topsFooter';
import { TopsHeader } from './topsHeader';

const TopsMainScreen = () => {
  const [topsData, setTopsData] = useState<TopsListItem[]>();
  const [type, setType] = useState<'artists' | 'tracks'>('artists');
  const [period, setPeriod] = useState<TopsPeriod>('short_term');
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

  const updateChartType = (newType: TopsChartType) => {
    setType(newType);
  };
  const updatePeriod = (newPeriod: TopsPeriod) => {
    setPeriod(newPeriod);
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
          <TopsHeader
            type={type}
            period={period}
            updateChartType={updateChartType}
            updatePeriod={updatePeriod}
          />
        }
        ListFooterComponent={type === 'tracks' ? <TopsFooter period={period} /> : null}
      />
    </View>
  );
};

export default TopsMainScreen;
