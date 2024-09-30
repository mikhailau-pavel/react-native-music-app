import PlaylistItem from '@/app/components/lists/playlistItem';
import { SectionList, Text, StyleSheet} from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { PlaybackContext } from '@/app/context/playbackContext';
import React from 'react';
import { NowPlayingHeader } from './nowPlaying';
import { EmptyQueueComponent } from './emptyQueue';



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
