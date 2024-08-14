import { fetchCurrentUserPlaylists, requestAccessToken, resetAccessToken } from '@/api/api';
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
      <Image source={{ height: 120, width: 120, uri: item.imageURL }} />
      <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
    </View>
  </TouchableOpacity>
);

const HomeScreen = ({ route, navigation }: HomeScreenProps) => {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('');
  const [currentPlaylistsList, setCurrentPlaylistsList] = useState(playlistsMockList);
  const [isLogined, setIsLogined] = useState(false);

  
  const tokenCheck = useCallback(async () => {
    const token = await getData('access_token');
    const status = !!token
    setIsLogined(status);
  }, [route]);
  
  useEffect(() => {
    if (route.params?.loginAttempt) {
      tokenCheck();
    }
  }, [tokenCheck, route]);
  
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
      if (isLogined) {
        await fetchCurrentUserPlaylists();
        await readPlaylistsFromStorage();
        await createPlaylistsList();
      }
    };
    getPlaylists();
  }, [createPlaylistsList, isLogined, tokenCheck, route]);

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
              playlistCover: item.imageURL,
              playlistTitle: item.title,
            });
          }
        }}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
    // }
  };
  if (!isLogined) {
    return (
      <ImageBackground
        source={require('../../../assets/images/main_background.png')}
        resizeMode="cover"
        style={styles.background}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Login');
          }}
          style={styles.welcomeButton}
        >
          <Text style={styles.welcomeText}>Hello, tap to login!</Text>
        </TouchableOpacity>
      </ImageBackground>
    );
  } else {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../../../assets/images/main_background.png')}
          resizeMode="cover"
          style={styles.background}
        >
          <FlatList
            data={currentPlaylistsList}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            extraData={selectedPlaylistId}
            numColumns={2}
            ListFooterComponent={
              <TouchableOpacity
                onPress={() => {
                  resetAccessToken();
                  setIsLogined(false);
                }}
                style={styles.welcomeButton}
              >
                <Text style={styles.welcomeText}>Log out</Text>
              </TouchableOpacity>
            }
          />
        </ImageBackground>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    padding: 5,
  },
  item: {
    flex: 1,
    backgroundColor: '#7bfdc7',
    margin: 5,
  },
  title: {
    gap: 5,
    fontFamily: 'AngemeBold',
    fontSize: 20,
    alignSelf: 'flex-end',
  },
  welcomeButton: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 200,
    height: 'auto',
  },
  welcomeText: {
    fontFamily: 'Beograd',
    fontSize: 20,
  },
});
export default HomeScreen;
