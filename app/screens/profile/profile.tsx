import { fetchUserProfile } from '@/api/api';
import { ProfileScreenUserData } from '@/types/types';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';

const ProfileScreen = () => {
  const [profileData, setProfileData] = useState<ProfileScreenUserData>();

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
  }, []);

  return (
    <View style={styles.profileContainer}>
      <Text style={styles.profileName}>{profileData?.name}</Text>
      <Text style={styles.followersCount}>Followers: {profileData?.followersCount}</Text>
      <Image style={styles.profilePicture} source={{ uri: profileData?.imageUrl }} />
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
