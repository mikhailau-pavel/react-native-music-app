import { fetchTracksFromPlaylist } from '@/api/api';
import {
  CurrentPlaylistTracksResponse,
  PlaylistScreenProps,
  TrackItemData,
  TrackItemProps,
} from '@/types/types';
import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  View,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  TextInput,
} from 'react-native';

const mockImage = 'https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228';
const tracksMockList: TrackItemData[] = [
  {
    title: 'Track_item_1',
    artist: 'track-1',
    imageURL: mockImage,
    trackId: '3cEYpjA9oz9GiPac4AsH4nsa',
  },
  {
    title: 'Track_item_2',
    artist: 'track-2',
    imageURL: mockImage,
    trackId: '3cEYpjA9oz9GiPac4AsH4nur',
  },
  {
    title: 'Track_item_3',
    artist: 'track-3',
    imageURL: mockImage,
    trackId: '3cEYpjA9oz9GiPac4AsH4ner',
  },
  {
    title: 'Track_item_4',
    artist: 'track-4',
    imageURL: mockImage,
    trackId: '3cEYpjA9oz9GiPac4AsH4n3rKe',
  },
];

const TrackItem = ({ item, onPress, backgroundColor, textColor }: TrackItemProps) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor }]}>
    <View style={styles.item}>
      <Image source={{ height: 70, width: 70, uri: item.imageURL }} />
      <Text style={[styles.title, { color: textColor }]}>
        {item.title} by {item.artist}
      </Text>
    </View>
  </TouchableOpacity>
);

const PlaylistScreen = ({ route, navigation }: PlaylistScreenProps) => {
  const [selectedTrackId, setSelectedTrackId] = useState<string>('');
  const [currentPlaylistsTracks, setCurrentPlaylistsTracks] = useState(tracksMockList);

  const createPlaylistsTrackList = useCallback(async (playlistId: string) => {
    const tracks = await fetchTracksFromPlaylist(playlistId);
    if (tracks) {
      const currentPlaylistTracks = tracks.map((elem: CurrentPlaylistTracksResponse) => {
        const test = new Object({
          title: elem.track.name,
          artist: elem.track.artists[0].name,
          imageURL: elem.track.album.images[0].url,
          trackId: elem.track.id,
        });
        return test;
      });
      setCurrentPlaylistsTracks(currentPlaylistTracks);
    } else {
      setCurrentPlaylistsTracks(tracksMockList);
    }
  }, []);

  useEffect(() => {
    const getTrackFromPlaylist = async () => {
      const playlistIdProp = route.params.playlistId;
      await createPlaylistsTrackList(playlistIdProp);
    };
    getTrackFromPlaylist();
  }, [createPlaylistsTrackList, route.params.playlistId]);

  const renderTrackItem = ({ item }: { item: TrackItemData }) => {
    const backgroundColor = '#017371';
    const color = 'black';

    return (
      <TrackItem
        item={item}
        onPress={() => {
          setSelectedTrackId(item.trackId);
        }}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/images/main_background.png')}
        resizeMode="cover"
      >
        <TextInput style={styles.searchbar}>Searchbar?</TextInput>
        <Pressable>
          <Text>Sort button</Text>
        </Pressable>
        <Text>Album cover</Text>
        <Text>PlaylistName</Text>
        <Text>PlaylistDescription</Text>
        <Text>All songs duration</Text>
        <Pressable>
          <Text>Enhance</Text>
        </Pressable>
        <Pressable>
          <Text>Invite button</Text>
        </Pressable>
        <Pressable>
          <Text>Option dots</Text>
        </Pressable>
        <Pressable>
          <Text>Play button</Text>
        </Pressable>
        <FlatList
          data={currentPlaylistsTracks}
          renderItem={renderTrackItem}
          keyExtractor={(item) => item.trackId}
          extraData={selectedTrackId}
        />
        <Pressable>
          <Text>Add songs</Text>
        </Pressable>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: '#7bfdc7',
  },
  searchbar: {
    borderWidth: 3,
  },
  title: {
    fontSize: 20,
  },
});

export default PlaylistScreen;
