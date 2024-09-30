import { ColorsSet } from '@/types/types';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: ColorsSet) =>
  StyleSheet.create({
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
