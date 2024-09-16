import { fetchTracksFromPlaylist } from '@/api/api';
import {
  CurrentAlbumTracksResponse,
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
  KeyboardAvoidingView,
} from 'react-native';
import { PlaybackContext } from '@/scripts/playbackContext';
import { createPlayback, playTrack, stopTrack, unloadSound } from '@/scripts/player';
import { getAlbum } from '@/api/albums';

const PlaylistScreen = ({ route, navigation }: PlaylistScreenProps) => {
  const { playbackData, setPlaybackData } = useContext(PlaybackContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handlePlayPlaylistButtonPress = async () => {
    if (playbackData.currentPlaylistData) {
      const item = playbackData.currentPlaylistData[0];
      if (playbackData.currentSound) {
        stopTrack(playbackData.currentSound);
        unloadSound(playbackData.currentSound);
      }
      const newSound = await createPlayback(item.previewUrl);
      setPlaybackData({
        ...playbackData,
        currentArtist: item.artist,
        currentSong: item.title,
        currentAlbumImage: item.imageURL,
        isPlaying: true,
        currentSound: newSound,
        currentTrackNumberInPlaylist: 0,
      });
      if (newSound) {
        playTrack(newSound);
      }
      setPlaybackData({ isShowing: false });
    }
    navigation.navigate('Player');
  };

  const setTrackInPlayer = async (item: TrackItemData, index: number) => {
    if (playbackData.currentSound) {
      stopTrack(playbackData.currentSound);
      unloadSound(playbackData.currentSound);
    }
    const newSound = await createPlayback(item.previewUrl);
    setPlaybackData({
      ...playbackData,
      currentArtist: item.artist,
      currentSong: item.title,
      currentAlbumImage: item.imageURL,
      isPlaying: true,
      isShowing: true,
      currentSound: newSound,
      currentTrackNumberInPlaylist: index,
    });
    if (newSound) {
      playTrack(newSound);
    }
  };

  const TrackItem = ({ item, index, onPress, backgroundColor, textColor }: TrackItemProps) => (
    <TouchableOpacity
      onPress={() => {
        setTrackInPlayer(item, index);
      }}
      style={styles.trackItemContainer}
    >
      <Image
        style={styles.trackAlbumImage}
        source={{ uri: item.imageURL }}
      />
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const createPlaylistsTrackList = useCallback(async (playlistId: string) => {
    const tracks = await fetchTracksFromPlaylist(playlistId);
    const currentPlaylistTracks = tracks.map((elem: CurrentPlaylistTracksResponse) => {
      const tracksInfoList = {
        title: elem.track.name,
        artist: elem.track.artists[0].name,
        imageURL: elem.track.album.images[0].url,
        trackId: elem.track.id,
        previewUrl: elem.track.preview_url,
      };
      return tracksInfoList;
    });
    setPlaybackData({ currentPlaylistData: currentPlaylistTracks });
  }, []);

  const createAlbumTrackList = useCallback(async (playlistId: string) => {
    const albumInfo = await getAlbum(playlistId);
    const tracks = albumInfo.tracks.items;
    const currentPlaylistTracks = tracks.map((elem: CurrentAlbumTracksResponse) => {
      const tracksInfoList = {
        title: elem.name,
        artist: albumInfo.artists[0].name,
        imageURL: albumInfo.images[0].url,
        trackId: elem.id,
        previewUrl: elem.preview_url,
      };
      return tracksInfoList;
    });
    setPlaybackData({ currentPlaylistData: currentPlaylistTracks });
  }, []);

  useEffect(() => {
    const getTracksFromPlaylist = async () => {
      const playlistIdProp = route.params.playlistId;
      await createPlaylistsTrackList(playlistIdProp);
    };
    const getTracksFromAlbum = async () => {
      const albumIdProp = route.params.playlistId;
      await createAlbumTrackList(albumIdProp);
    };
    if (route.params.type === 'playlist') {
      getTracksFromPlaylist();
    } else getTracksFromAlbum();
  }, [createAlbumTrackList, createPlaylistsTrackList, route.params.playlistId, route.params.type]);

  const filteredTracks = playbackData.currentPlaylistData
    ? playbackData.currentPlaylistData.filter(
        (track) =>
          track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.artist.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const renderHeader = () => {
    if (isSearchFocused) return null;
    return (
      <View style={styles.playlistHeader}>
        <Image
          style={styles.playlistCover}
          source={{ uri: route.params.playlistCover }}
        />
        <Text style={styles.playlistTitle}>{route.params.playlistTitle}</Text>
        <TouchableOpacity
          style={styles.playButton}
          onPress={handlePlayPlaylistButtonPress}
        >
          <Text style={styles.playButtonText}>PLAY</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTrackItem = ({ item, index }: { item: TrackItemData; index: number }) => {
    const backgroundColor = '#017371';
    const color = 'black';
    return (
      <TrackItem
        item={item}
        index={index}
        onPress={() => {
          setPlaybackData({
            currentTrackNumberInPlaylist: index,
          });
        }}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <KeyboardAvoidingView 
      //"behavior" on ios?
      style={styles.container}
    >
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#B3B3B3"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />
      </View>
      <FlatList
        data={filteredTracks}
        renderItem={renderTrackItem}
        keyExtractor={(item) => item.trackId}
        ListHeaderComponent={renderHeader}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  searchContainer: {
    padding: 10,
    backgroundColor: '#282828', 
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    color: '#121212',
    fontFamily: 'AngemeRegular',
  },
  playlistHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#017371',
  },
  playlistCover: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  playlistTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    fontFamily: 'AngemeBold',
  },
  playButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  trackItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  trackAlbumImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 5,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'AngemeBold',
  },
  trackArtist: {
    color: '#B3B3B3',
    fontSize: 14,
    fontFamily: 'AngemeRegular',
  },
});

export default PlaylistScreen;
