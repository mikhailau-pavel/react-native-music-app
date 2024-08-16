import { PlayerScreenProps } from '@/types/types';
import { useEffect, useState } from 'react';
import {
  Button,
  Text,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';

const PlayerScreen = ({ route, navigation }: PlayerScreenProps) => {
  const [sound, setSound] = useState<Sound>();
  const [currentTrackInPlaylist, setCurrentTrackInPlaylist] = useState(0);

  const playlistInfoArr = route.params;
  const amountOfTrackInPlaylist = playlistInfoArr.length - 1;

  console.log('playlist info from player', playlistInfoArr[currentTrackInPlaylist]);
  const playSound = async () => {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    const { sound } = await Audio.Sound.createAsync({
      uri: route.params[currentTrackInPlaylist].previewUrl,
    });
    setSound(sound);
    await sound.playAsync();
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <ImageBackground
      source={require('../../../assets/images/main_background.png')}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.trackCoverContainer}>
        <Text style={styles.trackTitle}>{route.params[currentTrackInPlaylist].title}</Text>
        <Image
          style={styles.trackCover}
          source={{ height: 300, width: 300, uri: route.params[currentTrackInPlaylist].imageURL }}
        />
      </View>
      <View style={styles.trackControlContainer}>
        {/* faded version of the button for disabled? */}
        <TouchableOpacity
          onPress={() => {
            if (currentTrackInPlaylist >= amountOfTrackInPlaylist) {
              setCurrentTrackInPlaylist(currentTrackInPlaylist - 1);
            } else return;
          }}
        >
          <Image
            style={styles.playButton}
            source={require('../../../assets/images/elements/play-button-image-transparent.png')}
          ></Image>
        </TouchableOpacity>
        <TouchableOpacity onPress={playSound}>
          <Image
            style={styles.playButton}
            source={require('../../../assets/images/elements/play-button-image-transparent.png')}
          ></Image>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (currentTrackInPlaylist < amountOfTrackInPlaylist) {
              setCurrentTrackInPlaylist(currentTrackInPlaylist + 1);
            } else return;
          }}
        >
          <Image
            style={styles.playButton}
            source={require('../../../assets/images/elements/play-button-image-transparent.png')}
          ></Image>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  trackCoverContainer: {
    backgroundColor: '#017371',
    margin: 5,
  },
  trackCover: {
    alignSelf: 'center',
  },
  trackTitle: {
    fontSize: 40,
    alignSelf: 'center',
    fontFamily: 'AngemeBold',
    margin: 5,
  },
  trackControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 60,
    height: 60,
    alignSelf: 'flex-end',
    margin: 15,
  },
});

export default PlayerScreen;
