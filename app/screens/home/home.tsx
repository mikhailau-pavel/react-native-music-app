import React, { useContext } from 'react';
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

import { fetchCurrentUserPlaylists, resetAccessToken } from '@/api/api';
import { getData } from '@/scripts/asyncStorage';
import {
  CurrentUserPlaylist,
  HomeScreenProps,
  PlaylistItemData,
  PlaylistItemProps,
} from '@/types/types';
import { AuthContext } from '@/app/context/authContext';

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

const PlaylistItem = ({
  item,
  onPress,
  isSelected,
}: PlaylistItemProps & { isSelected: boolean }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.item, isSelected && { backgroundColor: '#017371' }]}
  >
    <View style={styles.itemContent}>
      <Image source={{ uri: item.imageURL }} style={styles.itemImage} />
      <Text style={[styles.title, isSelected && { color: '#FFFFFF' }]}>{item.title}</Text>
    </View>
  </TouchableOpacity>
);

const HomeScreen = ({ route, navigation }: HomeScreenProps) => {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('');
  const [currentPlaylistsList, setCurrentPlaylistsList] = useState(playlistsMockList);
  const [isLogined] = useState(false);
  const { authData, setAuthData } = useContext(AuthContext);
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
        return {
          title: elem.name,
          id: `${elem.name}-${index}`,
          imageURL: `${elem.images[0].url}`,
          playlistId: `${elem.id}`,
        }
      });
      setCurrentPlaylistsList(currentPlaylistsList);
    } else {
      await fetchCurrentUserPlaylists();
      await readPlaylistsFromStorage();
      await createPlaylistsList();
    }
  },[]);

  useEffect(() => {
    const tokenCheck = async () => {
      const token = await getData('access_token');
      if (token) {
        setAuthData({ ...authData, isSignedIn: true });
        await createPlaylistsList();
      }
    };
    tokenCheck();
  },[authData, createPlaylistsList, setAuthData]);

  useEffect(() => {
    const getPlaylists = async () => {
      if (isLogined) {
        await fetchCurrentUserPlaylists();
        await readPlaylistsFromStorage();
        await createPlaylistsList();
      }
    };
    getPlaylists();
  }, [createPlaylistsList, isLogined, route]);

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
              type: 'playlist',
            });
          }
        }}
        isSelected={item.id === selectedPlaylistId}
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
        style={styles.background}
      >
        <FlatList
          data={currentPlaylistsList}
          renderItem={({ item }) => (
            <PlaylistItem
              item={item}
              isSelected={item.id === selectedPlaylistId}
              onPress={() => {
                setSelectedPlaylistId(item.id);
                navigation.navigate('Playlist', {
                  playlistId: item.playlistId,
                  playlistCover: item.imageURL,
                  playlistTitle: item.title,
                  type: 'playlist',
                });
              }}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 8 }}
          ListFooterComponent={
            <TouchableOpacity
              onPress={() => {
                resetAccessToken();
                setAuthData({ ...authData, isSignedIn: false });
              }}
              style={styles.logoutButton}
            >
              <Text style={styles.logoutText}>Log out</Text>
            </TouchableOpacity>
          }
        />
      </ImageBackground>
    </View>
  );
  // }
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#16171b',
  },
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: '#282828',
    flex: 1,
    margin: 5,
    borderRadius: 8,
    overflow: 'hidden',
  },
  itemContent: {
    padding: 10,
  },
  itemImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 4,
  },
  title: {
    fontFamily: 'AngemeBold',
    fontSize: 16,
    color: '#FFFFFF',
    padding: 10,
  },
  welcomeButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#7bfdc7',
    padding: 15,
    borderRadius: 25,
    marginVertical: 20,
  },
  welcomeText: {
    fontFamily: 'Beograd',
    fontSize: 18,
    color: '#FFFFFF',
  },
  logoutButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#017371',
    padding: 15,
    borderRadius: 25,
    marginVertical: 20,
  },
  logoutText: {
    fontFamily: 'Beograd',
    fontSize: 18,
    color: '#FFFFFF',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 280,
    height: 280,
    marginBottom: 30,
  },
  welcomeTitle: {
    fontFamily: 'AngemeBold',
    fontSize: 32,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: '#7bfdc7',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 30,
  },
  loginButtonText: {
    fontFamily: 'AngemeBold',
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
export default HomeScreen;
