import { NotFoundScreenProps } from '@/types/types';
import { SafeAreaView, Text } from 'react-native';

const NotFoundScreen = ({ route, navigation }: NotFoundScreenProps) => {
  return (
    <SafeAreaView>
      <Text>404 Not Found</Text>
    </SafeAreaView>
  );
};

export default NotFoundScreen;
