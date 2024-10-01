import { ColorsSet } from '@/types/types';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: ColorsSet) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    sectionHeaderText: {
      color: '#fff',
      fontWeight: 'bold',
      padding: 10,
    },
    trackAlbumImage: {
      width: 50,
      height: 50,
      marginRight: 10,
      borderRadius: 5,
    },
    nowPlayingContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.border,
    },
    nowPlayingIcon: {
      alignSelf: 'center',
      color: colors.notification,
    },
    nowPlayingInfo: {
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
  });
