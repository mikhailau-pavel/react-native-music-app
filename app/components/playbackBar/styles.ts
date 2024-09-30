import { ColorsSet } from '@/types/types';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: ColorsSet) =>
  StyleSheet.create({
    playbackBar: {
      flex: 1,
      width: '90%',
      alignSelf: 'center',
      flexDirection: 'row',
      position: 'absolute',
      bottom: 40,
      margin: 10,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 15,
      alignItems: 'center',
      shadowColor: '#000',
      elevation: 5,
    },
    playbackBarImage: {
      flex: 1,
      height: 55,
      width: 55,
      margin: 5,
      borderRadius: 10,
    },
    playbackBarText: { flex: 2 },
    playbackBarButtonContainer: {
      flex: 1,
    },
    playbackBarButtonImage: {
      height: 55,
      width: 55,
    },
    trackCreditsContainer: {
      flex: 5,
    },
    playButtonContainer: {
      flex: 1,
    },
  });
