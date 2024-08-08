import { storeData } from '@/scripts/asyncStorage';
import { codeChallenge, generateRandomString } from '@/scripts/authentication';
import { LoginScreenProps } from '@/types/types';
import { useEffect, useState } from 'react';
import { Button, Platform, Text, View } from 'react-native';
import * as Linking from 'expo-linking';
import { useQuery } from '@tanstack/react-query';
import { WebView } from 'react-native-webview';

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
    console.log('url', authUrl.toString());
    return authUrl.toString();
  };

  const { data } = useQuery({ queryKey: [loginUrl], queryFn: createLoginUrl });

  console.log('data', data);

  const handleLogin = async () => {
    if (data && (Platform.OS === 'ios' || Platform.OS === 'android')) {
      setLoginUrl(data);
    } else if (data && Platform.OS === 'web') {
      setLoginUrl(data);
      Linking.openURL(data);
    }
  };

  const parseResponseCode = (string: string) => {
    //make it calc origin url + fixed part of response
    return string.substring(34)
  }

  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    console.log('webview url', loginUrl);

    return (
      <View style={{ flex: 1, backgroundColor: 'tomato' }}>
        {loginUrl ? <WebView
          style={{ flex: 1, backgroundColor: 'tomato' }}
          source={{ uri: loginUrl }}
          onNavigationStateChange={({ url }) => {
            console.log('webview version of url', parseResponseCode(url));
          }}
          javaScriptEnabled
          domStorageEnabled
          originWhitelist={['*']}
        /> : null}
        <Button title="login" onPress={handleLogin}></Button>
      </View>
    );
  }

  return (
    <View>
      <Text>This is login page text placeholder. Test PKCE steps</Text>
      <Button title="login" onPress={handleLogin}></Button>
      <Text>{Platform.Version}</Text>
      <Button title="test profile" onPress={() => navigation.navigate('Profile')}></Button>
    </View>
  );
};

export default LoginScreen;
