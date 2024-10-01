import { ColorsSet } from '@/types/types';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: ColorsSet) =>
  StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: '#16171b',
    },
    container: {
      flex: 1,
    },
    item: {
      backgroundColor: '#282828',
      flex: 1,
      margin: 5,
      borderRadius: 8,
      overflow: 'hidden',
    },
    itemContent: {
      padding: 10,
    },
    itemImage: {
      width: '100%',
      aspectRatio: 1,
      borderRadius: 4,
    },
    title: {
      fontFamily: 'AngemeBold',
      fontSize: 16,
      color: '#FFFFFF',
      padding: 10,
    },
    welcomeButton: {
      alignItems: 'center',
      alignSelf: 'center',
      backgroundColor: '#7bfdc7',
      padding: 15,
      borderRadius: 25,
      marginVertical: 20,
    },
    welcomeText: {
      fontFamily: 'Beograd',
      fontSize: 18,
      color: '#FFFFFF',
    },
    loginContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    logo: {
      width: 280,
      height: 280,
      marginBottom: 30,
    },
    welcomeTitle: {
      fontFamily: 'AngemeBold',
      fontSize: 32,
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: 10,
    },
    loginButton: {
      backgroundColor: '#7bfdc7',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 30,
      marginTop: 30,
    },
    loginButtonText: {
      fontFamily: 'AngemeBold',
      fontSize: 18,
      color: '#FFFFFF',
      textAlign: 'center',
    },
  });
