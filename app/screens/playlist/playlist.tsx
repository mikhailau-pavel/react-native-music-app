import { fetchTracksFromPlaylist } from '@/api/api';
import {
  CurrentAlbumTracksResponse,
  PlaylistScreenProps,
  SelectedPlaylistTracksResponse,
  TrackItemData,
} from '@/types/types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  FlatList,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { PlaybackContext } from '@/app/context/playbackContext';
import { player } from '@/scripts/player';
import { getAlbum } from '@/api/albums';

import { useTranslation } from 'react-i18next';
import { useTheme } from '@react-navigation/native';
import { getStyles } from './styles';
import { TrackItem } from './trackItem';

const PlaylistScreen = ({ route, navigation }: PlaylistScreenProps) => {
  const { playbackData, setPlaybackData } = useContext(PlaybackContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = getStyles(colors);

  const handlePlayPlaylistButtonPress = async () => {
    if (playbackData.currentPlaylistData) {
      const item = playbackData.currentPlaylistData[0];
      if (playbackData.currentSound) {
        player.stopTrack(playbackData.currentSound);
        player.unloadSound(playbackData.currentSound);
      }
      const newSound = await player.createPlayback(item.previewUrl);
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
        player.playTrack(newSound);
      }
      setPlaybackData({ isShowing: false });
    }
    navigation.navigate('Player');
  };

  
  
  const createPlaylistsTrackList = useCallback(async (playlistId: string) => {
    const tracks = await fetchTracksFromPlaylist(playlistId);
    const selectedPlaylistTracks = tracks.map((elem: SelectedPlaylistTracksResponse) => {
      const tracksData = {
        title: elem.track.name,
        artist: elem.track.artists[0].name,
        imageURL: elem.track.album.images[0].url,
        trackId: elem.track.id,
        previewUrl: elem.track.preview_url,
      };
      return tracksData;
    });

    setPlaybackData({
      currentPlaylistData: selectedPlaylistTracks,
      queue: [
        // { title: 'Now playing:', data: selectedPlaylistTracks.splice(0,1) },
        // { title: 'Next in queue: ', data: []},
        {
          title: 'Next from:',
          data: [
            ...selectedPlaylistTracks,
            ...selectedPlaylistTracks,
            ...selectedPlaylistTracks,
            ...selectedPlaylistTracks,
            ...selectedPlaylistTracks,
            ...selectedPlaylistTracks,
          ],
        },
      ],
    });
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
