import { fetchUserProfile } from '@/api/api';
import { ProfileScreenUserData } from '@/types/types';
import { Languages } from '@/utils/language/LanguageUtils';
import { useTheme } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { Text, View, StyleSheet, Image, Switch, useColorScheme, Appearance } from 'react-native';

const ProfileScreen = () => {
  const [profileData, setProfileData] = useState<ProfileScreenUserData>();
  const [isThemeSwitchEnabled, setIsThemeSwitchEnabled] = useState(false);
  const [isLanguageSwitchEnabled, setIsLanguageSwitchEnabled] = useState(false);
  const colorScheme = useColorScheme();
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();

  const toggleTheme = () => {
    if (colorScheme === 'dark') {
      Appearance.setColorScheme('light');
    } else {
      Appearance.setColorScheme('dark');
    }
    setIsThemeSwitchEnabled((previousState) => !previousState);
  };

  const toggleLanguage = () => {
    const currentLanguage = i18n.language;
    i18n.changeLanguage(currentLanguage === Languages.EN ? Languages.PL : Languages.EN, () =>
      setIsLanguageSwitchEnabled((previousState) => !previousState)
    );
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
    setIsThemeSwitchEnabled(colorScheme === 'dark');
  }, []);

  return (
    <View style={styles.profileContainer}>
      <Text style={styles.profileName}>{profileData?.name}</Text>
      <Text style={styles.followersCount}>Followers: {profileData?.followersCount}</Text>
      <Text style={styles.followersCount}>{t('test')}</Text>
      <Text style={{ fontFamily: 'AngemeBold' }}>ą, ć, ę</Text>
      <Image style={styles.profilePicture} source={{ uri: profileData?.imageUrl }} />
      <Text style={{ color: colors.text }}>Change app's theme:</Text>
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isThemeSwitchEnabled ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleTheme}
        value={isThemeSwitchEnabled}
      />
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isLanguageSwitchEnabled ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleLanguage}
        value={isLanguageSwitchEnabled}
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
