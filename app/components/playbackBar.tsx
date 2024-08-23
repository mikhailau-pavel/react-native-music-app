import { PlaybackContext } from '@/scripts/playbackContext';
import { pauseTrack, playTrack } from '@/scripts/player';
import { useContext } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';

const PlaybackBar = () => {
  const { playbackData, setPlaybackData } = useContext(PlaybackContext);
  const handlePlayButton = () => {
    if (playbackData.currentSound && !playbackData.isPlaying) {
      playTrack(playbackData.currentSound);
      setPlaybackData({ ...playbackData, isPlaying: true });
    } else if (playbackData.currentSound && playbackData.isPlaying) {
      pauseTrack(playbackData.currentSound);
      setPlaybackData({ ...playbackData, isPlaying: false });
    }
  };

  return (
    //opposite
    <View style={playbackData.isShowing ? styles.playbackBar : { display: 'none' }}>
      <Image
        style={styles.playbackBarImage}
        source={{ uri: playbackData.currentAlbumImage }}
      ></Image>
      <Text style={styles.playbackBarText}>
        {playbackData.currentSong} by {playbackData.currentArtist}
      </Text>
      <TouchableOpacity onPress={handlePlayButton}>
        <Image
          style={styles.playbackBarButtonImage}
          source={
            playbackData.isPlaying
              ? require('../../assets/icons/pauseTrackButton.png')
              : require('../../assets/icons/playButton.png')
          }
        ></Image>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  playbackBar: {
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
    height: 55,
    minWidth: 55,
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
});

export default PlaybackBar;
