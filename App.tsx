import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Text } from 'react-native';
import LoginScreen from './app/screens/login/login';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from './app/screens/profile/profile';
import { PropsRoutes, RootStackParamList } from './types/types';
import HomeScreen from './app/screens/home/home';
import * as Linking from 'expo-linking';
import NotFoundScreen from './app/screens/notFound/notFound';
import PlaylistScreen from './app/screens/playlist/playlist';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
// if (__DEV__) {
//   require('./ReactotronConfig');
// }
SplashScreen.preventAutoHideAsync();
const prefix = Linking.createURL('/');

export default function App() {
  const [loaded, error] = useFonts({
    'Beograd': require('./assets/fonts/Beograd.ttf'),
    'Cartoon': require('./assets/fonts/Cartoon1471Extended-x3oyq.ttf'),
    'Hiykaya': require('./assets/fonts/HiykayaRegular.ttf'),
    'AngemeBold': require('./assets/fonts/Angeme-Bold.ttf'),
    'AngemeRegular': require('./assets/fonts/Angeme-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  const queryClient = new QueryClient();
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const config = {
    screens: {
      Home: 'home',
      Login: 'login',
      Profile: 'profile',
      Playlist: 'playlist',
      NotFound: '*',
    },
  };

  const linking = {
    prefixes: [prefix],
    config,
  };
  
  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <QueryClientProvider client={queryClient}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name={PropsRoutes.HOME}
            component={HomeScreen}
            options={{ title: 'Home' }}
          />
          <Stack.Screen
            name={PropsRoutes.LOGIN}
            component={LoginScreen}
            options={{ title: 'Login' }}
          />
          <Stack.Screen
            name={PropsRoutes.PROFILE}
            component={ProfileScreen}
            options={{ title: 'Profile' }}
          />
          <Stack.Screen
            name={PropsRoutes.PLAYLIST}
            component={PlaylistScreen}
            options={{ title: 'Playlist' }}
          />
          <Stack.Screen
            name={'NotFound'}
            component={NotFoundScreen}
            options={{ title: '404 Not Found' }}
          />
        </Stack.Navigator>
      </QueryClientProvider>
    </NavigationContainer>
  );
}
