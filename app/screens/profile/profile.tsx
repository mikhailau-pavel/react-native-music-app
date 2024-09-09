import { fetchUserProfile } from '@/api/api';
import { ProfileScreenUserData } from '@/types/types';
import { useTheme } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, Switch, useColorScheme, Appearance } from 'react-native';

const ProfileScreen = () => {
  const [profileData, setProfileData] = useState<ProfileScreenUserData>();
  const [isEnabled, setIsEnabled] = useState(false);
  const colorScheme = useColorScheme();
  const { colors } = useTheme()

  const toggleSwitch = () => {
    if (colorScheme === 'dark') {
      Appearance.setColorScheme('light');
    } else {
      Appearance.setColorScheme('dark');
    }
    setIsEnabled((previousState) => !previousState);
  };
  useEffect(() => {
    const fetchProfile = async () => {
      const fetchProfileResponse = await fetchUserProfile();
      const data = {
        name: fetchProfileResponse.display_name,
        followersCount: fetchProfileResponse.followers.total,
        imageUrl: fetchProfileResponse.images[0].url,
      };
      setProfileData(data);
    };
    fetchProfile();
    setIsEnabled(colorScheme === 'dark');
  }, []);

  return (
    <View style={styles.profileContainer}>
      <Text style={styles.profileName}>{profileData?.name}</Text>
      <Text style={styles.followersCount}>Followers: {profileData?.followersCount}</Text>
      <Image style={styles.profilePicture} source={{ uri: profileData?.imageUrl }} />
      <Text style={{color: colors.text}}>Change app's theme:</Text>
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
      <Text style={styles.followersCount}>Color scheme: {colorScheme}</Text>
    
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  profileName: { flex: 1 },
  followersCount: { flex: 1 },
  profilePicture: { flex: 1, width: 50, height: 50 },
});
export default ProfileScreen;
