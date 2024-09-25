import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Platform, Text, UIManager, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { initialPlaybackData, PlaybackContext, PlaybackData } from './app/context/playbackContext';
import PlaybackBar from './app/components/playbackBar/playbackBar';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { linking, Tabs } from './app/navigation/navigation';
import { CustomLightTheme, CustomDarkTheme } from './app/style/themes';
import './utils/language/i18NextConfig';
import { AuthContext, AuthContextData, initialAuthData } from './app/context/authContext';
import LoadingIndicator from './app/components/loader/loader';

// if (__DEV__) {
//   require('./ReactotronConfig');
// }

SplashScreen.preventAutoHideAsync();

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const queryClient = new QueryClient();

export default function App() {
  const [loaded, error] = useFonts({
    Beograd: require('./assets/fonts/Beograd.ttf'),
    Cartoon: require('./assets/fonts/Cartoon1471Extended-x3oyq.ttf'),
    Hiykaya: require('./assets/fonts/HiykayaRegular.ttf'),
    AngemeBold: require('./assets/fonts/Angeme-Bold.ttf'),
    AngemeRegular: require('./assets/fonts/Angeme-Regular.ttf'),
  });
  const colorScheme = useColorScheme();
  const [playbackData, setPlaybackData] = useState(initialPlaybackData);
  const [authData, setAuthData] = useState<AuthContextData>(initialAuthData);
  const handleChangePBData = (input: PlaybackData) => {
    setPlaybackData((prevState) => {
      return {
        ...prevState,
        ...input,
      };
    });
  };

  const authContextValue = { authData, setAuthData };
  const playbackContextValue = { playbackData, setPlaybackData: handleChangePBData };

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <NavigationContainer
      linking={linking}
      theme={colorScheme === 'light' ? CustomLightTheme : CustomDarkTheme}
      fallback={<LoadingIndicator/>}
    >
      <AuthContext.Provider value={authContextValue}>
        <PlaybackContext.Provider value={playbackContextValue}>
          <QueryClientProvider client={queryClient}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Tabs />
              <PlaybackBar />
            </GestureHandlerRootView>
          </QueryClientProvider>
        </PlaybackContext.Provider>
      </AuthContext.Provider>
    </NavigationContainer>
  );
}
