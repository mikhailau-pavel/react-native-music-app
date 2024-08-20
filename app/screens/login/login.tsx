import { createLoginUrl, parseResponseCode, requestAccessToken } from '@/scripts/authentication';
import { LoginScreenProps } from '@/types/types';
import { useEffect, useState } from 'react';
import { Button, Platform, View } from 'react-native';
import * as Linking from 'expo-linking';
import { useQuery } from '@tanstack/react-query';
import { WebView } from 'react-native-webview';
import { getData, storeData } from '@/scripts/asyncStorage';

const LoginScreen = ({ route, navigation }: LoginScreenProps) => {
  const [loginUrl, setLoginUrl] = useState<string>('');
  const loginUrlQuery = useQuery({ queryFn: createLoginUrl, queryKey: ['get_login_url'] });
  const accessTokenQuery = useQuery({
    queryFn: requestAccessToken,
    queryKey: ['request_access_token'],
    enabled: false,
  });

  useEffect(() => {
    if (loginUrlQuery.data && (Platform.OS === 'ios' || Platform.OS === 'android')) {
      setLoginUrl(loginUrlQuery.data);
    } else if (loginUrlQuery.data && Platform.OS === 'web') {
      setLoginUrl(loginUrlQuery.data);
      Linking.openURL(loginUrlQuery.data);
    }
  }, [loginUrlQuery.data]);

  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    return (
      <View style={{ flex: 1 }}>
        {loginUrl ? (
          <WebView
            style={{ flex: 1 }}
            source={{ uri: loginUrl }}
            onNavigationStateChange={async ({ url }) => {
              if (url.includes('localhost:8081/profile?code=')) {
                await storeData('responseCode', parseResponseCode(url));
                await accessTokenQuery.refetch();
                const testToken = await getData('access_token');
                if (accessTokenQuery.data) {
                  await storeData('access_token', accessTokenQuery.data.access_token);
                  await storeData('refresh_token', accessTokenQuery.data.refresh_token);
                  const testToken = await getData('access_token');
                }
                //goBack after
                navigation.navigate('Home', { loginAttempt: true });
              }
            }}
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
