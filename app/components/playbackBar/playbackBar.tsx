import { PlaybackContext } from '@/scripts/playbackContext';
import { pauseTrack, playTrack } from '@/scripts/player';
import { RootStackParamList } from '@/types/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useContext } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';

const PlaybackBar = () => {
  const { playbackData, setPlaybackData } = useContext(PlaybackContext);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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
    setPlaybackData({ ...playbackData, isShowing: true });
  };

  return (
    <View style={playbackData.isShowing ? styles.playbackBar : { display: 'none' }}>
      <TouchableOpacity onPress={handlePlaybackBarPress} style={styles.trackCreditsContainer}>
        <Image
          style={styles.playbackBarImage}
          source={{ uri: playbackData.currentAlbumImage }}
        ></Image>
        <Text style={styles.playbackBarText}>{playbackData.isPlaying}</Text>
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

const styles = StyleSheet.create({
  playbackBar: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 40,
    margin: 10,
    //picker?
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    elevation: 5,
  },
  playbackBarImage: {
    flex: 1,
    height: 55,
    width: 55,
    margin: 5,
    borderRadius: 10,
  },
  playbackBarText: { flex: 2 },
  playbackBarButtonContainer: {
    flex: 1,
  },
  playbackBarButtonImage: {
    height: 55,
    width: 55,
  },
  trackCreditsContainer: {
    flex: 5,
  },
  playButtonContainer: {
    flex: 1,
  },
});

export default PlaybackBar;
