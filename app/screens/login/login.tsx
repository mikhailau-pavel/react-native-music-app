import { createLoginUrl, parseResponseCode, requestAccessToken } from '@/scripts/authentication';
import { LoginScreenProps } from '@/types/types';
import { useContext, useEffect, useState } from 'react';
import { Button, Platform, View } from 'react-native';
import * as Linking from 'expo-linking';
import { useQuery } from '@tanstack/react-query';
import { WebView } from 'react-native-webview';
import { storeData } from '@/scripts/asyncStorage';
import { AuthContext } from '@/app/context/authContext';

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [loginUrl, setLoginUrl] = useState<string>('');
  const loginUrlQuery = useQuery({ queryFn: createLoginUrl, queryKey: ['get_login_url'] });
  const accessTokenQuery = useQuery({
    queryFn: requestAccessToken,
    queryKey: ['request_access_token'],
    enabled: false,
  });
  const {authData, setAuthData} = useContext(AuthContext)

  useEffect(() => {
    if (loginUrlQuery.data && (Platform.OS === 'ios' || Platform.OS === 'android')) {
      setLoginUrl(loginUrlQuery.data);
    } else if (loginUrlQuery.data && Platform.OS === 'web') {
      setLoginUrl(loginUrlQuery.data);
      Linking.openURL(loginUrlQuery.data);
    }
  }, [loginUrlQuery.data]);

  const handleNavigationStateChange = async ({ url }: { url: string }) => {
    if (url.startsWith('musicapp://')) {
      const responseCode = parseResponseCode(url);
      await storeData('responseCode', responseCode);
      await accessTokenQuery.refetch();

      if (accessTokenQuery.data) {
        await storeData('access_token', accessTokenQuery.data.access_token);
        await storeData('refresh_token', accessTokenQuery.data.refresh_token);
      }
      setAuthData({...authData, isSignedIn: true})
      return false;
    }
    return true;
  };

  const onShouldStartLoadWithRequest = (request: { url: string }) => {
    if (request.url.startsWith('musicapp://')) {
      handleNavigationStateChange({ url: request.url });
      return false;
    }
    return true;
  };

  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    return (
      <View style={{ flex: 1 }}>
        {loginUrl ? (
          <WebView
            style={{ flex: 1 }}
            source={{ uri: loginUrl }}
            onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
            javaScriptEnabled
            domStorageEnabled
            originWhitelist={['*']}
          />
        ) : null}
      </View>
    );
  }

  return (
    <View>
      <Button title="login"></Button>
      <Button title="test profile" onPress={() => navigation.navigate('Profile')}></Button>
    </View>
  );
};

export default LoginScreen;
