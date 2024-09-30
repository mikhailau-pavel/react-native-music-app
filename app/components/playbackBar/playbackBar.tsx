import { PlaybackContext } from '@/app/context/playbackContext';
import { pauseTrack, playTrack } from '@/scripts/player';
import { RootStackParamList } from '@/types/types';
import { useNavigation, useTheme } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useContext } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { getStyles } from './styles';

const PlaybackBar = () => {
  const { playbackData, setPlaybackData } = useContext(PlaybackContext);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const handlePlayButton = () => {
    if (playbackData.currentSound && !playbackData.isPlaying) {
      playTrack(playbackData.currentSound);
      setPlaybackData({ ...playbackData, isPlaying: true });
    } else if (playbackData.currentSound && playbackData.isPlaying) {
      pauseTrack(playbackData.currentSound);
      setPlaybackData({ ...playbackData, isPlaying: false });
    }
  };

  const handlePlaybackBarPress = () => {
    navigation.navigate('Player');
    setPlaybackData({ ...playbackData, isShowing: false });
  };

  return (
    <View style={playbackData.isShowing ? styles.playbackBar : { display: 'none' }}>
      <TouchableOpacity onPress={handlePlaybackBarPress} style={styles.trackCreditsContainer}>
        <Image
          style={styles.playbackBarImage}
          source={{ uri: playbackData.currentAlbumImage }}
        ></Image>
        <Text style={styles.playbackBarText}>
          {playbackData.currentSong} by {playbackData.currentArtist}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePlayButton} style={styles.playButtonContainer}>
        <Image
          style={styles.playbackBarButtonImage}
          source={
            playbackData.isPlaying
              ? require('../../../assets/icons/pauseTrackButton.png')
              : require('../../../assets/icons/playButton.png')
          }
        ></Image>
      </TouchableOpacity>
    </View>
  );
};

export default PlaybackBar;
