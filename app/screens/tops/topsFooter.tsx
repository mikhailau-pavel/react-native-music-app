import { fetchUserTops } from '@/api/api';
import { createPlaylist, addTracksToPlaylist } from '@/api/playlists';
import { getUserData } from '@/api/user';
import { TopsPeriod, TopsResponseDataItem } from '@/types/types';
import { useTheme } from '@react-navigation/native';
import { t } from 'i18next';
import { Pressable, Text } from 'react-native';
import { getStyles } from './styles';

export const TopsFooter = ({ period }: { period: TopsPeriod }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

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

  const handlePress = async () => {
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
  };
  return (
    <Pressable
      style={({ pressed }) => [
        styles.topsCreatePlaylistButton,
        pressed
          ? { borderColor: '#FFFFFF', borderBottomWidth: 1, backgroundColor: '#767577' }
          : null,
      ]}
      onPressIn={handlePress}
    >
      <Text style={styles.buttonText}>{t('createPlaylist')}</Text>
    </Pressable>
  );
};
