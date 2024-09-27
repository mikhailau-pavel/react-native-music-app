import { fetchUserProfile, resetAccessToken } from '@/api/api';
import { ProfileScreenUserData } from '@/types/types';
import { Languages } from '@/utils/language/LanguageUtils';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Text,
  Button,
  View,
  StyleSheet,
  Image,
  Switch,
  useColorScheme,
  Appearance,
  TouchableOpacity,
} from 'react-native';
import QueueScreen from '../queue/queue';
import { AuthContext } from '@/app/context/authContext';
import LiveActivityControlModule from '../../../modules/fizl-live-activity-sample/src/LiveActivityControlModule';

const ProfileScreen = () => {
  const [profileData, setProfileData] = useState<ProfileScreenUserData>();
  const [isThemeSwitchEnabled, setIsThemeSwitchEnabled] = useState(false);
  const [isLanguageSwitchEnabled, setIsLanguageSwitchEnabled] = useState(false);
  const colorScheme = useColorScheme();
  const { t, i18n } = useTranslation();
  const { authData, setAuthData } = useContext(AuthContext);

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

  const handleStartActivityPress = () => {
    const currentTime = Date.now();
    const startTime = currentTime + 60 * 1000;
    const endTime = currentTime + 120 * 1000;
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    const activityParams = {
      startTime: startTime,
      endTime: endTime,
      headline: 'headline test',
      title: 'title test',
      widgetUrl: 'musicapp://home',
    };

    console.log('testing time: ', endDate, startDate);

    LiveActivityControlModule.startActivity(
      activityParams.startTime,
      activityParams.endTime,
      activityParams.headline,
      activityParams.title,
      activityParams.widgetUrl
    );
  };

  return (
    <View style={styles.profileContainer}>
      <View style={styles.profileHeader}>
        <Image style={styles.profilePicture} source={{ uri: profileData?.imageUrl }} />
        <View style={styles.headerInfo}>
          <Text style={styles.profileName}>{profileData?.name}</Text>
          <Text style={styles.followersCount}>
            {profileData?.followersCount}
            {t('followers')}
          </Text>
        </View>
      </View>

      <View style={styles.settingsContainer}>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>{t('darkTheme')}</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#1DB954' }}
            thumbColor={isThemeSwitchEnabled ? '#ffffff' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleTheme}
            value={isThemeSwitchEnabled}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>{t('language')}</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#1DB954' }}
            thumbColor={isLanguageSwitchEnabled ? '#ffffff' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleLanguage}
            value={isLanguageSwitchEnabled}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            resetAccessToken();
            setAuthData({ ...authData, isSignedIn: false });
          }}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
        <Button title={'Start activity'} onPress={handleStartActivityPress} />
        <QueueScreen />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  headerInfo: {
    flex: 1,
  },
  profileName: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  followersCount: {
    color: '#b3b3b3',
    fontSize: 16,
  },
  settingsContainer: {
    marginBottom: 30,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
  },
  settingLabel: {
    color: '#ffffff',
    fontSize: 18,
  },
  logoutButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#017371',
    padding: 15,
    borderRadius: 25,
    marginVertical: 20,
  },
  logoutText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});

export default ProfileScreen;
