import { ColorsSet } from '@/types/types';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: ColorsSet) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#121212',
    },
    topItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#282828',
    },
    topItemRank: {
      color: '#b3b3b3',
      fontSize: 16,
      width: 30,
      textAlign: 'center',
    },
    topItemImage: {
      width: 50,
      height: 50,
      marginRight: 15,
    },
    topItemText: {
      color: '#ffffff',
      fontSize: 16,
      flex: 1,
    },
    topsTopBarContainer: {
      backgroundColor: '#121212',
      paddingTop: 20,
      paddingBottom: 10,
    },
    topsTopBarTypeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
    },
    topsTopBarTypeButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
    },
    topsTopBarPeriodContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    topsTopBarPeriodButton: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 15,
    },
    activeTypeButton: {
      backgroundColor: '#1DB954',
    },
    activePeriodButton: {
      backgroundColor: '#535353',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: 'bold',
    },
    topsCreatePlaylistButton: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: colors.background,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      marginBottom: 20,
    },
  });
