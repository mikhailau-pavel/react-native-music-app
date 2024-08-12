import { ProfileScreenProps } from '@/types/types';
import { Button, Text, View } from 'react-native';

const ProfileScreen = ({ route, navigation }: ProfileScreenProps) => {
  return (
    <View>
      <Text>This is Profile Page text placeholder. Only authorized users allowed here.</Text>
      <Button title="to home" onPress={() => navigation.navigate('Home')}></Button>
    </View>
  );
};

export default ProfileScreen;
