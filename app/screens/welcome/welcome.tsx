import { WelcomeScreenProps } from '@/types/types';
import { useTheme } from '@react-navigation/native';
import { TouchableOpacity, View, Text, Image, Appearance } from 'react-native';
import { getStyles } from './styles';

const WelcomeScreen = ({ navigation }: WelcomeScreenProps) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const currentTheme = Appearance.getColorScheme();

  return (
    <View style={styles.loginContainer}>
      {currentTheme === 'light' ? (
        <Image
          source={require('../../../assets/images/welcome/welcome-light.png')}
          style={styles.logo}
        />
      ) : (
        <Image
          source={require('../../../assets/images/welcome/welcome-dark.png')}
          style={styles.logo}
        ></Image>
      )}

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

export default WelcomeScreen;
