import { Text, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginScreen from './app/screens/login/login';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  const queryClient = new QueryClient();
  return (
    <NavigationContainer>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <QueryClientProvider client={queryClient}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <LoginScreen />
            <Text>This is App text placeholder</Text>
          </View>
          <Text> index text</Text>
        </QueryClientProvider>
      </View>
    </NavigationContainer>
  );
}
