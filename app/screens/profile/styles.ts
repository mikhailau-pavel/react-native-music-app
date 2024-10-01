import { ColorsSet } from '@/types/types';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: ColorsSet) =>
  StyleSheet.create({
    profileContainer: {
      flex: 1,
      backgroundColor: '#121212',
      padding: 20,
    },
    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 30,
    },
    profilePicture: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginRight: 20,
    },
    headerInfo: {
      flex: 1,
    },
    profileName: {
      color: '#ffffff',
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    followersCount: {
      color: '#b3b3b3',
      fontSize: 16,
    },
    settingsContainer: {
      marginBottom: 30,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#282828',
    },
    settingLabel: {
      color: '#ffffff',
      fontSize: 18,
    },
    logoutButton: {
      alignItems: 'center',
      alignSelf: 'center',
      backgroundColor: '#017371',
      padding: 15,
      borderRadius: 25,
      marginVertical: 20,
    },
    logoutText: {
      fontSize: 18,
      color: '#FFFFFF',
    },
  });
