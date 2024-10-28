import { TrackItemData, TrackItemProps } from '@/types/types';
import { useTheme } from '@react-navigation/native';
import { TouchableOpacity, Image, View, Text } from 'react-native';
import { getStyles } from './styles';
import { useContext } from 'react';
import { PlaybackContext } from '@/app/context/playbackContext';
import { player } from '@/scripts/player';

export const TrackItem = ({ item, index }: TrackItemProps) => {
  const { playbackData, setPlaybackData } = useContext(PlaybackContext);
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const setTrackInPlayer = async (item: TrackItemData, index: number) => {
    if (playbackData.currentSound) {
      player.stopTrack(playbackData.currentSound);
      player.unloadSound(playbackData.currentSound);
    }

    const newSound = await player.createPlayback(item.previewUrl);
    setPlaybackData({
      ...playbackData,
      currentArtist: item.artist,
      currentSong: item.title,
      currentAlbumImage: item.imageURL,
      isPlaying: true,
      isShowing: true,
      currentSound: newSound,
      currentTrackNumberInPlaylist: index,
    });

    if (newSound) {
      player.playTrack(newSound);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        setTrackInPlayer(item, index);
      }}
      style={styles.trackItemContainer}
    >
      <Image style={styles.trackAlbumImage} source={{ uri: item.imageURL }} />
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
