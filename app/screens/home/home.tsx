import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
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
  const [isLogined, setIsLogined] = useState(false);

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
        };
      });
      setCurrentPlaylistsList(currentPlaylistsList);
    } else {
      setCurrentPlaylistsList(playlistsMockList);
    }
  }, []);

  useFocusEffect(() => {
    const tokenCheck = async () => {
      const token = await getData('access_token');
      if (token) {
        setIsLogined(true);
        await createPlaylistsList();
      }
    };
    tokenCheck();
  });

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
                  setIsLogined(false);
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
  }
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
  },
  item: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#7bfdc7',
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
    fontSize: 14,
    color: '#121212',
    marginTop: 8,
  },
  welcomeButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#1DB954',
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
});
export default HomeScreen;
