import { PlayerScreenProps } from '@/types/types';
import { Button, Text, View } from 'react-native';

const PlayerScreen = ({ route, navigation }: PlayerScreenProps) => {
  return (
    <View>
      <Text>This is Player Page text placeholder. Home of your song</Text>
      <Button title="stop" />
      <Button title="play" />
      <Button title="to home" onPress={() => navigation.navigate('Home')}></Button>
    </View>
  );
};

export default PlayerScreen;
