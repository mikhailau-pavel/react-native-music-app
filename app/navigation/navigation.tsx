import { PropsRoutes, RootStackParamList } from '@/types/types';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import HomeScreen from '../screens/home/home';
import LoginScreen from '../screens/login/login';
import NotFoundScreen from '../screens/notFound/notFound';
import PlayerScreen from '../screens/player/player';
import PlaylistScreen from '../screens/playlist/playlist';
import ProfileScreen from '../screens/profile/profile';
import TopsMainScreen from '../screens/tops/tops';

const prefix = Linking.createURL('/');
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator<RootStackParamList>();
const TopsStack = createNativeStackNavigator();
const config = {
  screens: {
    HomeStackScreen: {
      path: 'home',
      screens: {
        Home: 'home',
        Login: 'login',
        Profile: 'profile',
        Playlist: 'playlist',
        Player: 'player',
        NotFound: '*',
      },
    },
    TopsStackScreen: {
      path: 'tops',
      screens: {
        TopsMainScreen: 'topsMain',
      },
    },
  },
};

export const linking = {
  prefixes: [prefix],
  config,
};

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator initialRouteName="Home">
      <HomeStack.Screen
        name={PropsRoutes.HOME}
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <HomeStack.Screen
        name={PropsRoutes.LOGIN}
        component={LoginScreen}
        options={{ title: 'Login' }}
      />
      <HomeStack.Screen
        name={PropsRoutes.PROFILE}
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <HomeStack.Screen
        name={PropsRoutes.PLAYLIST}
        component={PlaylistScreen}
        options={{ title: 'Playlist' }}
      />
      <HomeStack.Screen
        name={PropsRoutes.PLAYER}
        component={PlayerScreen}
        options={{ title: 'Player' }}
      />
      <HomeStack.Screen
        name={'NotFound'}
        component={NotFoundScreen}
        options={{ title: '404 Not Found' }}
      />
    </HomeStack.Navigator>
  );
};

export const TopsStackScreen = () => {
  return (
    <TopsStack.Navigator>
      <TopsStack.Screen
        name="topsMain"
        component={TopsMainScreen}
        options={{ title: 'TopsMain' }}
      />
    </TopsStack.Navigator>
  );
};

export const Tabs = () => {
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Tab.Screen name="HomeStack" component={HomeStackScreen} />
      <Tab.Screen name="TopsStack" component={TopsStackScreen} />
    </Tab.Navigator>
  );
};
