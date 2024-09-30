import PlaylistItem from '@/app/components/lists/playlistItem';
import { useTheme } from '@react-navigation/native';
import { SectionList, Text, StyleSheet, View, Image } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { useContext, useEffect, useState } from 'react';
import { PlaybackContext } from '@/app/context/playbackContext';
import { getStyles } from './styles';

const mockNowPlayingItem = { song: 'Song 1', artist: 'Artist 1' };

const mockImage = 'https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228';

const NowPlayingHeader = () => {
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
  ) : null;
};

const EmptyQueueComponent = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: '#fff',
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Queue is empty</Text>
    </View>
  );
};

const QueueScreen = () => {
  const mockSections = [
    {
      title: 'Next in Queue:',
      data: [{ title: 'Song 1', artist: 'Artist 1' }],
      // renderItem: (item, index: number) => {
      //   return (
      //     <Text>test</Text>
      //     // <PlaylistItem item={item} index={index} onReorder={() => {}}></PlaylistItem>
      //   );
      // },
    },
    { title: 'Next from:', data: [{ title: 'Song 2', artist: 'Artist 2' }] },
  ];
  const { playbackData } = useContext(PlaybackContext);
  const [sections, setSections] = useState(mockSections);
  const [queueState, setQueueState] = useState(true);

  const styles = StyleSheet.create({
    sectionHeaderText: {
      color: '#fff',
      fontWeight: 'bold',
      padding: 10,
    },
  });

  const onReorder = (fromIndex: number, toIndex: number, sectionIndex: number) => {
    setSections((prevSections) => {
      const newSections = [...prevSections];
      const [reorderedItem] = newSections[sectionIndex].data.splice(fromIndex, 1);
      newSections[sectionIndex].data.splice(toIndex, 0, reorderedItem);
      return newSections;
    });
  };

  useEffect(() => {
    if (playbackData.queue) {
      const queue = playbackData.queue;
      // const data: { title: string; artist: string }[] = [];
      // queue[1].data.forEach((value) => {
      //   data.push({ title: value.title, artist: value.artist });
      // });

      setSections(playbackData.queue);
    }
  }, [playbackData.queue]);

  return (
    <SectionList
      renderItem={({ item, index, section, separators }) => {
        return (
          <PlaylistItem
            item={item}
            index={index}
            onReorder={(fromIndex, toIndex) =>
              onReorder(fromIndex, toIndex, sections.indexOf(section))
            }
            itemCount={section.data.length}
          />
        );
      }}
      sections={sections}
      ListHeaderComponent={NowPlayingHeader}
      ListEmptyComponent={EmptyQueueComponent}
      keyExtractor={(item, index) => item.title + index}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.sectionHeaderText}>{title}</Text>
      )}
      stickySectionHeadersEnabled={false}
      // CellRendererComponent={({ children }) => {
      //   return <>{children}</>;
      // }}
    />
  );
};

export default QueueScreen;
