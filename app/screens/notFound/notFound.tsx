import { NotFoundScreenProps } from '@/types/types';
import { Text, View } from 'react-native';

const NotFoundScreen = ({ route, navigation }: NotFoundScreenProps) => {
  return (
    <View>
      <Text>404 Not Found</Text>
    </View>
  );
};

export default NotFoundScreen;
