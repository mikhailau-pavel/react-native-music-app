import { ProfileScreenProps } from '@/types/types';
import { Text, View } from 'react-native';

const ProfileScreen = ({ route, navigation }: ProfileScreenProps) => {
  return (
    <View>
      <Text>This is Profile Page text placeholder. Only authorized users allowed here.</Text>
    </View>
  );
};

export default ProfileScreen;
