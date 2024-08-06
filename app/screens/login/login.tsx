import { getData, storeData } from '@/scripts/asyncStorage';
import { codeChallenge, generateRandomString } from '@/scripts/authentication';
import { AuthParams } from '@/types/types';
import { useState } from 'react';
import { Button, Text, View } from 'react-native';

const LoginScreen = () => {
  const [hashed, setHashed] = useState<string | null>(null);
  /*  const handleLogin = async () => {
    const hash = await codeChallenge();
    setHashed(hash);
    // return codeChallenge;
  }; */
  const handleLogin = () => {};
  const codeVerifier = generateRandomString(43)
  storeData('code_verifier', codeVerifier);
  const authUrl = new URL("https://accounts.spotify.com/authorize")

  const params = {
    response_type: 'code',
    client_id: 'e6d38f8e338847f0a2909ea813ec79e4',
    //process.env.CLIENT_ID,
    scope: 'user-read-private user-read-email',
    //process.env.SCOPE_LOGIN,
    code_challenge_method: 'S256',
    //process.env.CHALLENGE_METHOD,
    code_challenge: codeChallenge(),
    redirect_uri: 'http://localhost:8081'
    //process.env.REDIRECT_URI,
  }
  

  console.log('params', params)
  return (
    <View>
      <Text>This is login page text placeholder. Test PKCE steps</Text>
      <Text>{codeVerifier}</Text>
      <Button title="login" onPress={handleLogin}></Button>
    </View>
  );
};

export default LoginScreen;
