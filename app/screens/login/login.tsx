import { storeData } from '@/scripts/asyncStorage';
import { codeChallenge, generateRandomString } from '@/scripts/authentication';
import { LoginScreenProps } from '@/types/types';
import { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import * as Linking from 'expo-linking';

const LoginScreen = ({ route, navigation }: LoginScreenProps) => {
  const [hashed, setHashed] = useState<string>('');
  //setParams?
  const handleLogin = async () => {
    const hash = await codeChallenge();
    setHashed(hash);
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
    redirect_uri: 'http://localhost:8081/profile/',
    //process.env.REDIRECT_URI,
  };

  authUrl.search = new URLSearchParams(params).toString();


    Linking.openURL(authUrl.toString());
  }

  return (
    <View>
      <Text>This is login page text placeholder. Test PKCE steps</Text>
      
      <Button title="login" onPress={handleLogin}></Button>
      <Button title="test profile" onPress={() => navigation.navigate('Profile')}></Button>
    </View>
  );
};
//<Text>{authUrl.toString()}</Text>
export default LoginScreen;
