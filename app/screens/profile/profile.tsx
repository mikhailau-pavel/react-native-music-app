import { fetchUserProfile, resetAccessToken } from '@/api/api';
import { ProfileScreenUserData } from '@/types/types';
import { Languages } from '@/utils/language/LanguageUtils';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Text,
  Button,
  View,
  Image,
  Switch,
  useColorScheme,
  Appearance,
  TouchableOpacity,
} from 'react-native';
import QueueScreen from '../queue/queue';
import { AuthContext } from '@/app/context/authContext';
import { useTheme } from '@react-navigation/native';
import { getStyles } from './styles';
import { AllAsyncStorageKeys } from '@/utils/constants';
import { startActivity, endActivity } from '@/modules/live-activity-control';

const ProfileScreen = () => {
  const [profileData, setProfileData] = useState<ProfileScreenUserData>();
  const [isThemeSwitchEnabled, setIsThemeSwitchEnabled] = useState(false);
  const [isLanguageSwitchEnabled, setIsLanguageSwitchEnabled] = useState(false);
  const colorScheme = useColorScheme();
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const { authData, setAuthData } = useContext(AuthContext);
  const styles = getStyles(colors);
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
    const startTime = currentTime + 10 * 1000;
    const endTime = currentTime + 120 * 1000;
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    const activityParams = {
      startTime: startDate,
      endTime: endDate,
      headline: 'headline 2test',
      title: 'title test',
      widgetUrl: 'musicapp://home',
    };

    console.log('activity options: ', activityParams)
    startActivity(activityParams)
  };

  const handleStopActivityPress = ()=> {

    const activityEndParams = {
      headline: 'headline 2test',
      title: 'title test',
      widgetUrl: 'musicapp://home',
    }
    endActivity(activityEndParams)

  }


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
            resetAccessToken(AllAsyncStorageKeys);
            setAuthData({ ...authData, isSignedIn: false });
          }}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
        <Button title={'Start activity'} onPress={handleStartActivityPress} />
        <Button title={'Stop activity'} onPress={handleStopActivityPress} />
        <QueueScreen />
      </View>
    </View>
  );
};

export default ProfileScreen;
