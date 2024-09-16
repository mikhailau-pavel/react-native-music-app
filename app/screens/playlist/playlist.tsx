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
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const PlaylistScreen = ({ route, navigation }: PlaylistScreenProps) => {
  const { playbackData, setPlaybackData } = useContext(PlaybackContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { colors } = useTheme();
  const { t } = useTranslation();

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
      <Image style={styles.trackAlbumImage} source={{ uri: item.imageURL }} />
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
        <Image style={styles.playlistCover} source={{ uri: route.params.playlistCover }} />
        <Text style={styles.playlistTitle}>{route.params.playlistTitle}</Text>
        <TouchableOpacity style={styles.playButton} onPress={handlePlayPlaylistButtonPress}>
          <Text style={styles.playButtonText}>{t('play')}</Text>
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    searchContainer: {
      padding: 10,
      backgroundColor: colors.card,
    },
    searchInput: {
      backgroundColor: colors.background,
      borderRadius: 20,
      padding: 10,
      color: colors.text,
      fontFamily: 'AngemeRegular',
    },
    playlistHeader: {
      alignItems: 'center',
      padding: 20,
      backgroundColor: colors.primary,
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
      color: colors.text,
      marginBottom: 10,
      fontFamily: 'AngemeBold',
    },
    playButton: {
      backgroundColor: colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 40,
      borderRadius: 25,
    },
    playButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: 'bold',
    },
    trackItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.border,
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
      color: colors.text,
      fontSize: 16,
      fontFamily: 'AngemeBold',
    },
    trackArtist: {
      color: colors.text,
      fontSize: 14,
      fontFamily: 'AngemeRegular',
    },
  });

  return (
    <KeyboardAvoidingView
      //"behavior" on ios?
      style={styles.container}
    >
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t('search')}
          placeholderTextColor={colors.text}
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

export default PlaylistScreen;
