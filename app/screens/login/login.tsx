import { codeChallenge, parseResponseCode } from '@/scripts/authentication';
import { LoginScreenProps } from '@/types/types';
import { useState } from 'react';
import { Button, Platform, Text, View } from 'react-native';
import * as Linking from 'expo-linking';
import { useQuery } from '@tanstack/react-query';
import { WebView } from 'react-native-webview';
import { storeData } from '@/scripts/asyncStorage';

const LoginScreen = ({ route, navigation }: LoginScreenProps) => {
  const [loginUrl, setLoginUrl] = useState<string>('');
  const createLoginUrl = async () => {
    const hash = await codeChallenge();
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    const params = {
      response_type: 'code',
      client_id: 'e6d38f8e338847f0a2909ea813ec79e4',
      //process.env.CLIENT_ID,
      scope: 'user-read-private user-read-email',
      //process.env.SCOPE_LOGIN,
      code_challenge_method: 'S256',
      //process.env.CHALLENGE_METHOD,
      code_challenge: hash,
      redirect_uri: 'http://localhost:8081/profile',
      //process.env.REDIRECT_URI,
    };

    authUrl.search = new URLSearchParams(params).toString();
    return authUrl.toString();
  };

  const { data } = useQuery({ queryKey: [loginUrl], queryFn: createLoginUrl });

  const handleLogin = async () => {
    if (data && (Platform.OS === 'ios' || Platform.OS === 'android')) {
      setLoginUrl(data);
    } else if (data && Platform.OS === 'web') {
      setLoginUrl(data);
      Linking.openURL(data);
    }
  };

  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    return (
      <View style={{ flex: 1, backgroundColor: 'tomato' }}>
        {loginUrl ? (
          <WebView
            style={{ flex: 1, backgroundColor: 'tomato' }}
            source={{ uri: loginUrl }}
            onNavigationStateChange={({ url }) => {
              console.log('native code', parseResponseCode(url))
              storeData('responseCode', parseResponseCode(url));
            }}
            javaScriptEnabled
            domStorageEnabled
            originWhitelist={['*']}
          />
        ) : null}
        <Button title="login" onPress={handleLogin}></Button>
      </View>
    );
  }

  return (
    <View>
      <Text>This is login page text placeholder. Test PKCE steps</Text>
      <Button title="login" onPress={handleLogin}></Button>
      <Button title="test profile" onPress={() => navigation.navigate('Profile')}></Button>
    </View>
  );
};

export default LoginScreen;
