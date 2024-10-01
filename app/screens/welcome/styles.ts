import { ColorsSet } from '@/types/types';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: ColorsSet) =>
  StyleSheet.create({
    logo: {
      width: 280,
      height: 280,
      marginBottom: 30,
    },
    loginContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
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
