import { Text, View } from 'react-native';
import LoginScreen from './screens/login/login';

export default function App() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <LoginScreen/>
      <Text>This is App text placeholder</Text>
    </View>
  );
}
