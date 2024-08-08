import { HomeScreenProps } from '@/types/types';
import { Text, View, Button, ScrollView, Image, FlatList } from 'react-native';

const HomeScreen = ({ route, navigation }: HomeScreenProps) => {
  const isAuthorized = true;
  const mockImage = () => {
    return <Image source={require('../../../assets/images/react-logo.png')}></Image>
  }
  const mockList = ['Playlist_1', 'Playlist_2', 'Playlist_3', 'Playlist_4'];
  const mockLength = 10;

  return (
    <ScrollView>
      <View id='horizontalPlaylistGallery'>
        <FlatList data={mockList} renderItem={mockImage}/>
      </View>
      <Text>This is Home Page text placeholder. Only authorized users allowed here.</Text>
      <Button title="to login" onPress={() => navigation.navigate('Login')}></Button>
    </ScrollView>
  );
};

export default HomeScreen;
