import PlaylistItem from '@/app/components/lists/playlistItem';
import { useTheme } from '@react-navigation/native';
import { SectionList, Text, StyleSheet, View, Image, Touchable } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useContext, useEffect, useState } from 'react';
import { PlaybackContext } from '@/scripts/playbackContext';

const mockNowPlayingItem = { song: 'Song 1', artist: 'Artist 1' };

const mockSections = [
  {
    title: 'Next in Queue:',
    data: [{ song: 'Song 1', artist: 'Artist 1' }],
  },
  { title: 'Next from:', data: [{ song: 'Song 2', artist: 'Artist 2' }] },
];

const mockImage = 'https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228';

const NowPlayingHeader = () => {
  const { colors } = useTheme();
  const { playbackData } = useContext(PlaybackContext);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    sectionHeaderText: {
      color: '#fff',
    },
    trackAlbumImage: {
      width: 50,
      height: 50,
      marginRight: 10,
      borderRadius: 5,
    },
    nowPlayingContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.border,
    },
    nowPlayingIcon: {
      alignSelf: 'center',
    },
    nowPlayingInfo: {
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
  });

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeaderText}>Now playing:</Text>
      <View style={styles.nowPlayingContainer}>
        <View style={styles.nowPlayingInfo}>
          <Image
            style={styles.trackAlbumImage}
            source={{ uri: playbackData.currentAlbumImage ?? mockImage }}
          />
          <View>
            <Text style={styles.trackTitle} numberOfLines={1}>
              {playbackData.currentSong ?? mockNowPlayingItem.song}
            </Text>
            <Text style={styles.trackArtist} numberOfLines={1}>
              {playbackData.currentArtist ?? mockNowPlayingItem.artist}
            </Text>
          </View>
        </View>
        <Entypo
          name="dots-three-vertical"
          size={18}
          color={colors.text}
          style={styles.nowPlayingIcon}
        />
      </View>
    </View>
  );
};

const QueueScreen = () => {
  const { playbackData } = useContext(PlaybackContext);
  const [sections, setSections] = useState(mockSections);
  const styles = StyleSheet.create({
    sectionHeaderText: {
      color: '#fff',
    },
  });

  type QueueItem = {
    song: string;
    artist: string;
  };

  useEffect(() => {
    const data: QueueItem[] = [];
    if (playbackData.currentPlaylistData) {
      const temp = playbackData.currentPlaylistData.slice(
        playbackData.currentTrackNumberInPlaylist
      );
      console.log('test', temp.length);
      temp.forEach((item) => {
        return data.push({ song: item.title, artist: item.artist });
      });
    }
    const sections = [
      {
        title: 'Next in Queue:',
        data: [{ song: 'Song 1', artist: 'Artist 1' }],
      },
      { title: `Next from:`, data: data },
    ];
    setSections(sections);
  }, [playbackData]);

  return (
    <SectionList
      renderItem={PlaylistItem}
      sections={sections}
      ListHeaderComponent={NowPlayingHeader}
      keyExtractor={(item, index) => item.song + index}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.sectionHeaderText}>{title}</Text>
      )}
    />
  );
};

export default QueueScreen;
