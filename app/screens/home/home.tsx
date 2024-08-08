import { HomeScreenProps } from '@/types/types';
import { Text, View, Button } from 'react-native';

const HomeScreen = ({ route, navigation }: HomeScreenProps) => {
  return (
    <View>
      <Text>This is Home Page text placeholder. Only authorized users allowed here.</Text>
      <Button title="to login" onPress={() => navigation.navigate('Login')}></Button>
    </View>
  );
};

export default HomeScreen;
