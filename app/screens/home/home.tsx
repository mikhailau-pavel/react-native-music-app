import React, { useContext } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, View, ImageBackground } from 'react-native';
import { fetchCurrentUserPlaylists } from '@/api/api';
import { AsyncStorageKeys, storage } from '@/scripts/asyncStorage';
import { CurrentUserPlaylist, HomeScreenProps } from '@/types/types';
import { AuthContext } from '@/app/context/authContext';
import { useTheme } from '@react-navigation/native';
import { getStyles } from './styles';
import { playlistsMockList } from '@/utils/constants';
import { PlaylistItem } from './playlistItem';

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
