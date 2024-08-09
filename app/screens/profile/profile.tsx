import { fetchCurrentUserPlaylists, requestAccessToken } from '@/api/api';
import { getData, storeData } from '@/scripts/asyncStorage';
import { parseResponseCode } from '@/scripts/authentication';
import { ProfileScreenProps } from '@/types/types';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

const ProfileScreen = ({ route, navigation }: ProfileScreenProps) => {
  useEffect(() => {
    if (route.path) {
      const responseCode = parseResponseCode(route.path);
      storeData('responseCode', responseCode);
      requestAccessToken(responseCode);
      fetchCurrentUserPlaylists();
    }
  }, []);

  return (
    <View>
      <Text>This is Profile Page text placeholder. Only authorized users allowed here.</Text>
    </View>
  );
};

export default ProfileScreen;
