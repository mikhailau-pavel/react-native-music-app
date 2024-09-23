import {
  ProfilePropsRoutes,
  HomePropsRoutes,
  RootStackParamList,
  TopsPropsRoutes,
  TopsStackParamList,
  ProfileStackParamList,
} from '@/types/types';
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
import WelcomeScreen from '../screens/welcome/welcome';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

const prefix = Linking.createURL('/');
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator<RootStackParamList>();
const TopsStack = createNativeStackNavigator<TopsStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

const config = {
  screens: {
    HomeStackScreen: {
      path: 'home',
      screens: {
        Home: 'home',
        Profile: 'profile',
        Playlist: 'playlist',
        Player: 'player',
        NotFound: '*',
        Welcome: 'welcome',
        Login: 'Login',
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
  const { authData } = useContext(AuthContext);
  return (
    <HomeStack.Navigator>
      {authData.isSignedIn ? (
        <>
          <HomeStack.Screen
            name={HomePropsRoutes.HOME}
            component={HomeScreen}
            options={{ title: 'Home' }}
          />
          <HomeStack.Screen
            name={HomePropsRoutes.PLAYLIST}
            component={PlaylistScreen}
            options={{ title: 'Playlist' }}
          />
          <HomeStack.Screen
            name={HomePropsRoutes.PLAYER}
            component={PlayerScreen}
            options={{ title: 'Player' }}
          />
          <HomeStack.Screen
            name={'NotFound'}
            component={NotFoundScreen}
            options={{ title: '404 Not Found' }}
          />
        </>
      ) : (
        <>
          <HomeStack.Screen
            name={HomePropsRoutes.WELCOME}
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <HomeStack.Screen name={HomePropsRoutes.LOGIN} component={LoginScreen} />
        </>
      )}
    </HomeStack.Navigator>
  );
};

export const TopsStackScreen = () => {
  return (
    <TopsStack.Navigator>
      <TopsStack.Screen
        name={TopsPropsRoutes.TOPS}
        component={TopsMainScreen}
        options={{ title: 'TopsMain' }}
      />
    </TopsStack.Navigator>
  );
};

export const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name={ProfilePropsRoutes.PROFILE}
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </ProfileStack.Navigator>
  );
};

export const Tabs = () => {
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Main" component={HomeStackScreen} />
      <Tab.Screen name="Tops" component={TopsStackScreen} />
      <Tab.Screen name="Profile" component={ProfileStackScreen} />
    </Tab.Navigator>
  );
};
