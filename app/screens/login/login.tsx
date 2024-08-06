import { generateRandomString } from '@/scripts/authentication';
import { Button, Text, View } from 'react-native';

const LoginScreen = () => {
  const handleLogin = () => {
    return;
  };

  return (
    <View>
      <Text>This is login page text placeholder. Test PKCE steps</Text>
      <Text>{generateRandomString(43)}</Text>
      <Button title="login" onPress={handleLogin}></Button>
    </View>
  );
};

export default LoginScreen;
