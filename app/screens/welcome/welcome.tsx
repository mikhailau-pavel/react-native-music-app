import { WelcomeScreenProps } from '@/types/types';
import { useTheme } from '@react-navigation/native';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';

type ColorsSet = {
  primary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
};

const WelcomeScreen = ({ navigation }: WelcomeScreenProps) => {
  const { colors } = useTheme();

  const styles = getStyles(colors);

  return (
    <View style={styles.loginContainer}>
      <Image source={require('../../../assets/images/splash-dark.png')} style={styles.logo} />
      <Text style={styles.welcomeTitle}>Login</Text>
      <Text style={styles.welcomeTitle}>And Listen</Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Login');
        }}
        style={styles.loginButton}
      >
        <Text style={styles.loginButtonText}>Log in with Spotify</Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (colors: ColorsSet) =>
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

export default WelcomeScreen;
