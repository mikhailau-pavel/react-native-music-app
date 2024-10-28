import { PlaybackContext } from '@/app/context/playbackContext';
import { mockImage, mockNowPlayingItem } from '@/utils/constants';
import Entypo from '@expo/vector-icons/Entypo';
import { useTheme } from '@react-navigation/native';
import React, { useContext } from 'react';
import { View, Text, Image } from 'react-native';
import { getStyles } from './styles';

export const NowPlayingHeader = () => {
  const { colors } = useTheme();
  const { playbackData } = useContext(PlaybackContext);
  const styles = getStyles(colors);

  return playbackData.isPlaying ? (
    <View style={styles.container}>
      <Text style={styles.sectionHeaderText}>Now playing:</Text>
      <View style={styles.nowPlayingContainer}>
        <View style={styles.nowPlayingInfo}>
          <Image
            style={styles.trackAlbumImage}
            source={{ uri: playbackData.currentAlbumImage ?? mockImage }}
          />
          <>
            <Text style={styles.trackTitle} numberOfLines={1}>
              {playbackData.currentSong ?? mockNowPlayingItem.song}
            </Text>
            <Text style={styles.trackArtist} numberOfLines={1}>
              {playbackData.currentArtist ?? mockNowPlayingItem.artist}
            </Text>
          </>
        </View>
        <Entypo
          name="dots-three-vertical"
          size={18}
          color={colors.text}
          style={styles.nowPlayingIcon}
        />
      </View>
    </View>
  ) : null;
};
