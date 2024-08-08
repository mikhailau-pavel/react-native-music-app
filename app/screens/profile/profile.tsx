import { storeData } from '@/scripts/asyncStorage';
import { parseResponseCode } from '@/scripts/authentication';
import { ProfileScreenProps } from '@/types/types';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

const ProfileScreen = ({ route, navigation }: ProfileScreenProps) => {
  console.log('route-path', route)
  useEffect(() => {
  if (route.path) {
    const responseCode = parseResponseCode(route.path);
    storeData('responseCode', responseCode);
  }}
  , [])
  

  return (
    <View>
      <Text>This is Profile Page text placeholder. Only authorized users allowed here.</Text>
    </View>
  );
};

export default ProfileScreen;
