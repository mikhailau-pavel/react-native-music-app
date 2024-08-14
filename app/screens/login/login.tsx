import {
  base64encode,
  generateRandomString,
  parseResponseCode,
  sha256,
} from '@/scripts/authentication';
import { LoginScreenProps } from '@/types/types';
import { useState } from 'react';
import { Button, Platform, View } from 'react-native';
import * as Linking from 'expo-linking';
import { useQuery } from '@tanstack/react-query';
import { WebView } from 'react-native-webview';
import { storeData } from '@/scripts/asyncStorage';
import { requestAccessToken } from '@/api/api';

const LoginScreen = ({ route, navigation }: LoginScreenProps) => {
  const [loginUrl, setLoginUrl] = useState<string>('');
  const createLoginUrl = async () => {
    const codeVerifier = generateRandomString(44);
    storeData('code_verifier', codeVerifier);
    const sha = await sha256(codeVerifier);
    const base64String = base64encode(sha);

    const authUrl = new URL('http://accounts.spotify.com/authorize');
    const params = {
      response_type: 'code',
      client_id: 'e6d38f8e338847f0a2909ea813ec79e4',
      //process.env.CLIENT_ID,
      scope: 'user-read-private user-read-email',
      //process.env.SCOPE_LOGIN,
      code_challenge_method: 'S256',
      //process.env.CHALLENGE_METHOD,
      code_challenge: base64String,
      redirect_uri: 'http://localhost:8081/profile',
      //process.env.REDIRECT_URI,
    };

    authUrl.search = new URLSearchParams(params).toString();
    return authUrl.toString();
  };

  const { data } = useQuery({ queryFn: createLoginUrl, queryKey: ['get_login_url'] });

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
      <View style={{ flex: 1 }}>
        {loginUrl ? (
          <WebView
            style={{ flex: 1 }}
            source={{ uri: loginUrl }}
            onNavigationStateChange={ async ({ url }) => {
              if (url.includes('localhost:8081/profile?code=')) {
                storeData('responseCode', parseResponseCode(url));
                await requestAccessToken();
                navigation.navigate('Home', { loginAttempt: true });
              }
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
      <Button title="login" onPress={handleLogin}></Button>
      <Button title="test profile" onPress={() => navigation.navigate('Profile')}></Button>
    </View>
  );
};

export default LoginScreen;
