import PlaylistItem from '@/app/components/lists/playlistItem';
import { useTheme } from '@react-navigation/native';
import { SectionList, Text, StyleSheet, View, Image } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';

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
    trackInfoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.border,
    },
    nowPlayingIcon: {
      alignSelf: 'center'
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeaderText}>Now playing:</Text>
      <View style={styles.trackInfoContainer}>
      <View style={styles.trackInfoContainer}>
        <Image style={styles.trackAlbumImage} source={{ uri: mockImage }} />
        <PlaylistItem item={mockNowPlayingItem} />
        </View>
        <Entypo name="dots-three-vertical" size={18} color={colors.text} style={styles.nowPlayingIcon}/>
      </View>
    </View>
  );
};

const QueueScreen = () => {
  const styles = StyleSheet.create({
    sectionHeaderText: {
      color: '#fff',
    },
  });

  return (
    <SectionList
      renderItem={PlaylistItem}
      sections={mockSections}
      ListHeaderComponent={NowPlayingHeader}
      keyExtractor={(item, index) => item.song + index}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.sectionHeaderText}>{title}</Text>
      )}
    />
  );
};

export default QueueScreen;
