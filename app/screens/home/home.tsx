import { fetchCurrentUserPlaylists, fetchTracksFromPlaylist, requestAccessToken } from '@/api/api';
import { getData } from '@/scripts/asyncStorage';
import {
  CurrentUserPlaylist,
  HomeScreenProps,
  PlaylistItemData,
  PlaylistItemProps,
} from '@/types/types';
import { useCallback, useEffect, useState } from 'react';
import { Text, Button, Image, FlatList, StyleSheet, View, TouchableOpacity } from 'react-native';

const mockImage = 'https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228';
const mockPlaylistId = '3cEYpjA9oz9GiPac4AsH4n'

const playlistsMockList: PlaylistItemData[] = [
  { title: 'Playlist_item_1', id: 'playlist-1', imageURL: mockImage, playlistId: '3cEYpjA9oz9GiPac4AsH4n' },
  { title: 'Playlist_item_2', id: 'playlist-2', imageURL: mockImage, playlistId: '3cEYpjA9oz9GiPac4AsH4n' },
  { title: 'Playlist_item_3', id: 'playlist-3', imageURL: mockImage, playlistId: '3cEYpjA9oz9GiPac4AsH4n' },
  { title: 'Playlist_item_4', id: 'playlist-4', imageURL: mockImage, playlistId: '3cEYpjA9oz9GiPac4AsH4n' },
];
const tracksMockList: PlaylistItemData[] = [
  { title: 'Track_item_1', id: 'track-1', imageURL: mockImage, playlistId: '3cEYpjA9oz9GiPac4AsH4n' },
  { title: 'Track_item_2', id: 'track-2', imageURL: mockImage, playlistId: '3cEYpjA9oz9GiPac4AsH4n' },
  { title: 'Track_item_3', id: 'track-3', imageURL: mockImage, playlistId: '3cEYpjA9oz9GiPac4AsH4n' },
  { title: 'Track_item_4', id: 'track-4', imageURL: mockImage, playlistId: '3cEYpjA9oz9GiPac4AsH4n' },
];

const PlaylistItem = ({ item, onPress, backgroundColor, textColor }: PlaylistItemProps) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor }]}>
    <View style={styles.item}>
      <Image source={{ height: 100, width: 100, uri: item.imageURL }} />
      <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
    </View>
  </TouchableOpacity>
);

const TrackItem = ({ item, onPress, backgroundColor, textColor }: PlaylistItemProps) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor }]}>
    <View style={styles.item}>
      <Image source={require('../../../assets/images/react-logo.png')} />
      <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
    </View>
  </TouchableOpacity>
);

const HomeScreen = ({ route, navigation }: HomeScreenProps) => {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('');
  const [selectedTrackId, setSelectedTrackId] = useState<string>('');
  const [currentPlaylistsList, setCurrentPlaylistsList] = useState(playlistsMockList);

  const readPlaylistsFromStorage = async () => {
    const currentUserPlaylists = await getData('playlists');
    if (currentUserPlaylists) {
      const playlists = JSON.parse(currentUserPlaylists);
      return playlists;
    }
  };

  const createPlaylistsList = useCallback(async () => {
    const playlists = await readPlaylistsFromStorage();
    if (playlists) {
      const currentPlaylistsList = playlists.map((elem: CurrentUserPlaylist, index: number) => {
        console.log('playlists objects one by one', elem);
        return new Object({
          title: elem.name,
          id: `${elem.name}-${index}`,
          imageURL: `${elem.images[0].url}`,
          playlistId: `${elem.id}`,
        });
      });
      setCurrentPlaylistsList(currentPlaylistsList);
    } else {
      setCurrentPlaylistsList(playlistsMockList);
    }
  }, []);

  useEffect(() => {
    const getPlaylists = async () => {
      //or access token expired? refresh not to keep session alive
      if (typeof (await getData('access_token')) === 'undefined') {
        requestAccessToken();
      }
      await fetchCurrentUserPlaylists();
      await readPlaylistsFromStorage();
      await createPlaylistsList();
    };
    getPlaylists();
  }, [createPlaylistsList]);

  const renderItem = ({ item }: { item: PlaylistItemData }) => {
    const backgroundColor = item.id === selectedPlaylistId ? '#017371' : '#7bfdc7';
    const color = item.id === selectedPlaylistId ? 'white' : 'black';

    return (
      <PlaylistItem
        item={item}
        onPress={() => {
          fetchTracksFromPlaylist(item.playlistId)
          setSelectedPlaylistId(item.id)
        }}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
    // }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={currentPlaylistsList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={6}
        extraData={selectedPlaylistId}
      />
      <FlatList
        data={currentPlaylistsList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedTrackId}
      ></FlatList>
      <Text>This is Home Page text placeholder.</Text>
      <Button title="to login" onPress={() => navigation.navigate('Login')}></Button>
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
  title: {
    fontSize: 20,
  },
});
export default HomeScreen;
