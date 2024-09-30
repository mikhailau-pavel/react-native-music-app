import { ColorsSet } from '@/types/types';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: ColorsSet) =>
  StyleSheet.create({
    background: {
      flex: 1,
    },
    trackCoverGradient: {
      position: 'absolute',
      height: 600,
      left: 0,
      right: 0,
      top: 0,
    },
    trackCoverContainer: {
      margin: 5,
    },
    trackCover: {
      alignSelf: 'center',
    },
    trackTitle: {
      fontSize: 40,
      alignSelf: 'center',
      fontFamily: 'AngemeBold',
      margin: 5,
      color: colors.text,
    },
    trackInfoControlContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignContent: 'center',
    },
    trackControlContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    controlButton: {
      width: 60,
      height: 60,
      alignSelf: 'flex-end',
      margin: 15,
    },
  });
