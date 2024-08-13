import { fetchCurrentUserPlaylists, requestAccessToken } from '@/api/api';
import { getData } from '@/scripts/asyncStorage';
import {
  CurrentUserPlaylist,
  HomeScreenProps,
  PlaylistItemData,
  PlaylistItemProps,
} from '@/types/types';
import { useCallback, useEffect, useState } from 'react';
import { Text, Button, Image, FlatList, StyleSheet, View, TouchableOpacity } from 'react-native';

const playlistsMockList: PlaylistItemData[] = [
  { title: 'Playlist_item_1', id: 'playlist-1' },
  { title: 'Playlist_item_2', id: 'playlist-2' },
  { title: 'Playlist_item_3', id: 'playlist-3' },
  { title: 'Playlist_item_4', id: 'playlist-4' },
];
const tracksMockList: PlaylistItemData[] = [
  { title: 'Track_item_1', id: 'track-1' },
  { title: 'Track_item_2', id: 'track-2' },
  { title: 'Track_item_3', id: 'track-3' },
  { title: 'Track_item_4', id: 'track-4' },
];

const PlaylistItem = ({ item, onPress, backgroundColor, textColor }: PlaylistItemProps) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor }]}>
    <View style={styles.item}>
      <Image source={require('../../../assets/images/react-logo.png')} />
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
      const testPlaylistsList = playlists.map((elem: CurrentUserPlaylist, index: number) => {
        return new Object({ title: elem.name, id: `${elem.name}-${index}` });
      });
      setCurrentPlaylistsList(testPlaylistsList);
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
        onPress={() => setSelectedPlaylistId(item.id)}
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
      <Button title="to " onPress={() => navigation.navigate('Profile')}></Button>
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
