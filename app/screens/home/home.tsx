import { fetchCurrentUserPlaylists, requestAccessToken } from '@/api/api';
import { getData } from '@/scripts/asyncStorage';
import {
  CurrentUserPlaylist,
  HomeScreenProps,
  PlaylistItemData,
  PlaylistItemProps,
} from '@/types/types';
import { useCallback, useEffect, useState } from 'react';
import {
  Text,
  Button,
  Image,
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

const mockImage = 'https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228';

const playlistsMockList: PlaylistItemData[] = [
  {
    title: 'Playlist_item_1',
    id: 'playlist-1',
    imageURL: mockImage,
    playlistId: '3cEYpjA9oz9GiPac4AsH4n',
  },
  {
    title: 'Playlist_item_2',
    id: 'playlist-2',
    imageURL: mockImage,
    playlistId: '3cEYpjA9oz9GiPac4AsH4n',
  },
  {
    title: 'Playlist_item_3',
    id: 'playlist-3',
    imageURL: mockImage,
    playlistId: '3cEYpjA9oz9GiPac4AsH4n',
  },
  {
    title: 'Playlist_item_4',
    id: 'playlist-4',
    imageURL: mockImage,
    playlistId: '3cEYpjA9oz9GiPac4AsH4n',
  },
];

const PlaylistItem = ({ item, onPress, backgroundColor, textColor }: PlaylistItemProps) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor }]}>
    <View style={styles.item}>
      <Image source={{ height: 200, width: 200, uri: item.imageURL }} />
      <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
    </View>
  </TouchableOpacity>
);

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('');
  const [currentPlaylistsList, setCurrentPlaylistsList] = useState(playlistsMockList);

  const readPlaylistsFromStorage = async () => {
    const currentUserPlaylists = await getData('playlists');
    if (currentUserPlaylists) {
      const playlists = JSON.parse(currentUserPlaylists);
      return playlists;
    } else return null;
  };

  const createPlaylistsList = useCallback(async () => {
    const playlists = await readPlaylistsFromStorage();
    if (playlists) {
      const currentPlaylistsList = playlists.map((elem: CurrentUserPlaylist, index: number) => {
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
          setSelectedPlaylistId(item.id);
          if (typeof item.playlistId !== 'undefined') {
            navigation.navigate('Playlist', {
              playlistId: item.playlistId,
            });
          }
        }}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
    // }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/images/main_background.png')}
        resizeMode="cover"
      >
        <FlatList
          data={currentPlaylistsList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={selectedPlaylistId}
          numColumns={2}
        />
        <Button title="to login" onPress={() => navigation.navigate('Login')}></Button>
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
  title: {
    fontSize: 20,
  },
});
export default HomeScreen;
