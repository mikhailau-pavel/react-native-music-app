import { ColorsSet } from '@/types/types';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: ColorsSet) =>
  StyleSheet.create({
    progressBarContainer: {
      width: '100%',
    },
    barContainer: {
      height: 4,
      backgroundColor: 'grey',
      borderRadius: 2,
      margin: 10,
    },
    progressFiller: {
      height: '100%',
      backgroundColor: 'black',
      borderRadius: 2,
    },
    timersContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 5,
    },
    knob: {
      position: 'absolute',
      top: -8,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: 'white',
      borderWidth: 2,
      borderColor: 'black',
    },
  });
