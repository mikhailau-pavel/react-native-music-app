import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginScreen from './app/screens/login/login';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from './app/screens/profile/profile';
import { RootStackParamList } from './types/types';
import HomeScreen from './app/screens/home/home';

export default function App() {
  const queryClient = new QueryClient();
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <NavigationContainer>
      <QueryClientProvider client={queryClient}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
        </Stack.Navigator>
      </QueryClientProvider>
    </NavigationContainer>
  );
}
