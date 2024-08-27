import { fetchTracksFromPlaylist } from '@/api/api';
import {
  CurrentPlaylistTracksResponse,
  PlaylistScreenProps,
  TrackItemData,
  TrackItemProps,
} from '@/types/types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  FlatList,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  TextInput,
} from 'react-native';
import { PlaybackContext } from '@/scripts/playbackContext';
import { createPlayback } from '@/scripts/player';

const mockImage = 'https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228';
const tracksMockList: TrackItemData[] = [
  {
    title: 'Track_item_1',
    artist: 'track-1',
    imageURL: mockImage,
    trackId: '3cEYpjA9oz9GiPac4AsH4nsa',
    previewUrl: '',
  },
  {
    title: 'Track_item_2',
    artist: 'track-2',
    imageURL: mockImage,
    trackId: '3cEYpjA9oz9GiPac4AsH4nur',
    previewUrl: '',
  },
];

const PlaylistScreen = ({ route, navigation }: PlaylistScreenProps) => {
  const [selectedTrackId, setSelectedTrackId] = useState<string>('');
  const [currentPlaylistsTracks, setCurrentPlaylistsTracks] = useState(tracksMockList);
  const { playbackData, setPlaybackData } = useContext(PlaybackContext);

  const handleItemPress = async (item: TrackItemData, index: number) => {
    setPlaybackData({
      ...playbackData,
      currentArtist: item.artist,
      currentSong: item.title,
      currentAlbumImage: item.imageURL,
      isShowing: true,
      currentSound: await createPlayback(item.previewUrl),
      currentTrackNumberInPlaylist: index,
    });
  };

  // useEffect(() => {
  //   const playback = async () =>{
  //     if (playbackData.currentSound) {
  //       const result = await playTrack(playbackData.currentSound);
  //       setPlaybackData({ ...playbackData, isPlaying: result });
  //     }
  //   }
  //   playback()
  // }, [playbackData.currentSound]);

  const TrackItem = ({ item, index, onPress, backgroundColor, textColor }: TrackItemProps) => (
    <TouchableOpacity
      onPress={() => handleItemPress(item, index)}
      style={[styles.trackItemContainer, { backgroundColor }]}
    >
      <View style={styles.item}>
        <Image
          style={styles.trackAlbumImage}
          source={{ height: 70, width: 70, uri: item.imageURL }}
        />
        <Text style={[styles.title, { color: textColor }]}>
          {item.title} by {item.artist}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const createPlaylistsTrackList = useCallback(async (playlistId: string) => {
    const tracks = await fetchTracksFromPlaylist(playlistId);
    if (tracks) {
      const currentPlaylistTracks = tracks.map((elem: CurrentPlaylistTracksResponse) => {
        const tracksInfoList = new Object({
          title: elem.track.name,
          artist: elem.track.artists[0].name,
          imageURL: elem.track.album.images[0].url,
          trackId: elem.track.id,
          previewUrl: elem.track.preview_url,
        });
        return tracksInfoList;
      });
      setCurrentPlaylistsTracks(currentPlaylistTracks);
      setPlaybackData({ ...playbackData, currentPlaylistData: currentPlaylistTracks });
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

  const renderTrackItem = ({ item, index }: { item: TrackItemData; index: number }) => {
    const backgroundColor = '#017371';
    const color = 'black';
    return (
      <TrackItem
        item={item}
        index={index}
        onPress={() => {
          setPlaybackData({ ...playbackData, currentTrackNumberInPlaylist: index });
        }}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/main_background.png')}
      resizeMode="cover"
      style={styles.background}
    >
      <TextInput style={styles.searchbar}> Search</TextInput>
      <FlatList
        data={playbackData.currentPlaylistData}
        renderItem={renderTrackItem}
        keyExtractor={(item) => item.trackId}
        extraData={selectedTrackId}
        ListHeaderComponent={
          <View style={styles.playlistCoverContainer}>
            <Text style={styles.playlistTitle}>{route.params.playlistTitle}</Text>
            <Image
              style={styles.playlistCover}
              source={{ height: 300, width: 300, uri: route.params.playlistCover }}
            />
            <TouchableOpacity
              onPress={async () => {
                setPlaybackData({
                  ...playbackData,
                  isShowing: false,
                  currentArtist: playbackData.currentPlaylistData[0].artist,
                  currentSong: playbackData.currentPlaylistData[0].title,
                  currentAlbumImage: playbackData.currentPlaylistData[0].imageURL,
                  currentSound: await createPlayback(
                    playbackData.currentPlaylistData[0].previewUrl
                  ),
                  currentTrackNumberInPlaylist: 0,
                });
                navigation.navigate('Player', currentPlaylistsTracks);
              }}
            >
              <Image
                style={styles.playButton}
                source={require('../../../assets/icons/playButton.png')}
              ></Image>
            </TouchableOpacity>
          </View>
        }
      />
      {/* <TouchableOpacity>
        <Text>Add songs</Text>
      </TouchableOpacity> */}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  playlistCoverContainer: {
    backgroundColor: '#017371',
    margin: 5,
  },
  playlistTitle: {
    fontSize: 50,
    alignSelf: 'center',
    fontFamily: 'AngemeBold',
    margin: 5,
  },
  playlistCover: {
    alignSelf: 'center',
  },
  trackItemContainer: {
    flex: 1,
  },
  trackAlbumImage: {},
  pauseButtonContainer: {
    flex: 1,
    alignSelf: 'baseline',
    margin: 3,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#7bfdc7',
    margin: 5,
  },
  searchbar: {
    borderWidth: 3,
    backgroundColor: 'white',
    fontFamily: 'AngemeBold',
  },
  title: {
    fontFamily: 'AngemeBold',
    fontSize: 20,
    alignSelf: 'flex-end',
  },
  playButton: {
    width: 60,
    height: 60,
    alignSelf: 'flex-end',
    margin: 15,
  },
});

export default PlaylistScreen;
