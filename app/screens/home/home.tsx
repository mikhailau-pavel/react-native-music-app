import React, { useContext } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Text, Image, FlatList, View, TouchableOpacity, ImageBackground } from 'react-native';

import { fetchCurrentUserPlaylists } from '@/api/api';
import { AsyncStorageKeys, storage } from '@/scripts/asyncStorage';
import {
  CurrentUserPlaylist,
  HomeScreenProps,
  PlaylistItemData,
  PlaylistItemProps,
} from '@/types/types';
import { AuthContext } from '@/app/context/authContext';
import { useTheme } from '@react-navigation/native';
import { getStyles } from './styles';

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
}: PlaylistItemProps & { isSelected: boolean }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
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
};

const HomeScreen = ({ route, navigation }: HomeScreenProps) => {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('');
  const [currentPlaylistsList, setCurrentPlaylistsList] = useState(playlistsMockList);
  const [isLogined] = useState(false);
  const { authData, setAuthData } = useContext(AuthContext);
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const readPlaylistsFromStorage = async () => {
    const currentUserPlaylists = await storage.getData(AsyncStorageKeys.PLAYLISTS);
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
      await fetchCurrentUserPlaylists();
      await readPlaylistsFromStorage();
      await createPlaylistsList();
    }
  }, []);

  useEffect(() => {
    const tokenCheck = async () => {
      const token = await storage.getData(AsyncStorageKeys.ACCESS_TOKEN);
      if (token) {
        setAuthData({ ...authData, isSignedIn: true });
        await createPlaylistsList();
      }
    };
    tokenCheck();
  }, [createPlaylistsList, setAuthData]);

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
        />
      </ImageBackground>
    </View>
  );
};

export default HomeScreen;
