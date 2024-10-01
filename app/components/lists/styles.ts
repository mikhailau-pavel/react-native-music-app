import { ColorsSet } from '@/types/types';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: ColorsSet) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 0.5,
      borderBottomColor: colors.border,
      paddingHorizontal: 10,
      height: 50,
    },
    playingItemAlbumImage: {
      width: 50,
      height: 50,
      marginRight: 10,
      borderRadius: 5,
    },
    trackInfo: {
      flexDirection: 'row',
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
    checkbox: {
      margin: 8,
    },
  });
