import { fetchCurrentUserPlaylists, fetchTracksFromPlaylist, requestAccessToken } from '@/api/api';
import { getData } from '@/scripts/asyncStorage';
import {
  CurrentPlaylistTracksResponse,
  CurrentUserPlaylist,
  HomeScreenProps,
  PlaylistItemData,
  PlaylistItemProps,
  TrackItemData,
  TrackItemProps,
} from '@/types/types';
import { useCallback, useEffect, useState } from 'react';
import { Text, Button, Image, FlatList, StyleSheet, View, TouchableOpacity } from 'react-native';

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
    trackId: '3cEYpjA9oz9GiPac4AsH4nr',
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
    trackId: '3cEYpjA9oz9GiPac4AsH4nerKe',
  },
];

const PlaylistItem = ({ item, onPress, backgroundColor, textColor }: PlaylistItemProps) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor }]}>
    <View style={styles.item}>
      <Image source={{ height: 100, width: 100, uri: item.imageURL }} />
      <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
    </View>
  </TouchableOpacity>
);

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

const HomeScreen = ({ route, navigation }: HomeScreenProps) => {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('');
  const [selectedTrackId, setSelectedTrackId] = useState<string>('');
  const [currentPlaylistsList, setCurrentPlaylistsList] = useState(playlistsMockList);
  const [currentPlaylistsTracks, setCurrentPlaylistsTracks] = useState(tracksMockList);

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
        //console.log('playlists objects one by one', elem);
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

  const createPlaylistsTrackList = useCallback(async (playlistId: string) => {
    const tracks = await fetchTracksFromPlaylist(playlistId);
    if (tracks) {
      const currentPlaylistTracks = tracks.map((elem: CurrentPlaylistTracksResponse) => {
        const test = new Object({
          title: elem.track.name,
          artist: elem.track.artists[0].name,
          imageURL: elem.track.album.images[0].url,
          id: elem.id,
        });
        return test;
      });
      setCurrentPlaylistsTracks(currentPlaylistTracks);
    } else {
      setCurrentPlaylistsTracks(tracksMockList);
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
          //fetchTracksFromPlaylist(item.playlistId)
          createPlaylistsTrackList(item.playlistId);
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
      <FlatList
        data={currentPlaylistsList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedPlaylistId}
        horizontal
      />
      <FlatList
        data={currentPlaylistsTracks}
        renderItem={renderTrackItem}
        keyExtractor={(item) => item.trackId}
        extraData={selectedTrackId}
      ></FlatList>
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
