import { PlayerScreenProps } from '@/types/types';
import { useEffect, useRef, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  Animated,
  ScrollView,
  LayoutAnimation,
} from 'react-native';
import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';

const PlayerScreen = ({ route, navigation }: PlayerScreenProps) => {
  const [sound, setSound] = useState<Sound>();
  const [currentTrackInPlaylist, setCurrentTrackInPlaylist] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const [playTimeCurrent, setPlayTimeCurrent] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const progress = useRef(new Animated.Value(0)).current;

  const playlistInfoArr = route.params;
  const amountOfTracksInPlaylist = playlistInfoArr.length - 1;

  const playTrack = async () => {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    const track = await Audio.Sound.createAsync({
      uri: route.params[currentTrackInPlaylist].previewUrl,
    });

    setSound(track.sound);
    if (track) {
      await track.sound.playAsync();
    }
  };

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setExpanded(!expanded);
  };
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  if (sound) {
    sound._onPlaybackStatusUpdate = (playbackStatus) => {
      if (playbackStatus.isLoaded && playbackStatus.isPlaying && playbackStatus.durationMillis) {
        const currentTrackProgress = playbackStatus.positionMillis / playbackStatus.durationMillis;
        progress.setValue(currentTrackProgress * 100);
        setPlayTimeCurrent(playbackStatus.positionMillis);
        setPlayProgress(currentTrackProgress);
        Animated.timing(progress, {
          useNativeDriver: false,
          toValue: (currentTrackProgress + 1) * 100,
          duration: 200,
        }).start(({ finished }) => {
          // console.log('animation is over', finished);
        });
      }
    };
  }

  const pauseTrack = async () => {
    if (sound) await sound.pauseAsync();
  };

  const stopTrack = async () => {
    if (sound) await sound.stopAsync();
  };

  return (
    //scale track cover on Android depending on controls availability?
    <ScrollView style={styles.background}>
      <View style={styles.trackCoverContainer}>
        <Text style={styles.trackTitle}>{route.params[currentTrackInPlaylist].artist}</Text>
        <Image
          style={styles.trackCover}
          source={{ height: 300, width: 300, uri: route.params[currentTrackInPlaylist].imageURL }}
        />
        <Text style={styles.trackTitle}>{route.params[currentTrackInPlaylist].title}</Text>
        {!expanded ? (
          <View style={styles.trackInfoControlContainer}>
            <TouchableOpacity>
              <Image
                style={styles.controlButton}
                source={require('../../../assets/icons/favButton.png')}
              ></Image>
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                style={styles.controlButton}
                source={require('../../../assets/icons/loopButton.png')}
              ></Image>
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                style={styles.controlButton}
                source={require('../../../assets/icons/muteButton.png')}
              ></Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePress}>
              <Image
                style={styles.controlButton}
                source={require('../../../assets/icons/closeButton.png')}
              ></Image>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={handlePress}>
            <Image
              style={styles.controlButton}
              source={require('../../../assets/icons/infoButton.png')}
            ></Image>
          </TouchableOpacity>
        )}
        <View style={styles.timersContainer}>
          <Text>{`${Math.floor(playTimeCurrent / 1000 / 60)}:${Math.floor((playTimeCurrent / 1000) % 60) < 10 ? '0' : ''}${Math.floor((playTimeCurrent / 1000) % 60)}`}</Text>
          <Text>0:29</Text>
        </View>
        <View style={styles.barContainer}>
          <Animated.View style={[styles.bar, { width: `${playProgress * 100}%` }]} />
        </View>
      </View>
      <View style={styles.trackControlContainer}>
        {!(currentTrackInPlaylist === 0) ? (
          <TouchableOpacity
            onPress={() => {
              if (currentTrackInPlaylist > 0) {
                setCurrentTrackInPlaylist(currentTrackInPlaylist - 1);
                setIsPlaying(false);
                stopTrack();
              } else return;
            }}
          >
            <Image
              style={[styles.controlButton]}
              source={require('../../../assets/icons/prevTrackButton.png')}
            ></Image>
          </TouchableOpacity>
        ) : (
          <Image
            style={[styles.controlButton, { opacity: 0.3 }]}
            source={require('../../../assets/icons/prevTrackButton.png')}
          ></Image>
        )}
        <TouchableOpacity
          onPress={() => {
            if (!isPlaying) {
              playTrack();
              setIsPlaying(true);
            } else {
              pauseTrack();
              setIsPlaying(false);
            }
          }}
        >
          {!isPlaying ? (
            <Image
              style={styles.controlButton}
              source={require('../../../assets/icons/playButton.png')}
            ></Image>
          ) : (
            <Image
              style={styles.controlButton}
              source={require('../../../assets/icons/pauseTrackButton.png')}
            ></Image>
          )}
        </TouchableOpacity>
        {!(currentTrackInPlaylist === amountOfTracksInPlaylist) ? (
          <TouchableOpacity
            onPress={() => {
              if (currentTrackInPlaylist < amountOfTracksInPlaylist) {
                setCurrentTrackInPlaylist(currentTrackInPlaylist + 1);
                setIsPlaying(false);
                stopTrack();
              } else return;
            }}
          >
            <Image
              style={styles.controlButton}
              source={require('../../../assets/icons/nextTrackButton.png')}
            ></Image>
          </TouchableOpacity>
        ) : (
          <Image
            style={[styles.controlButton, { opacity: 0.3 }]}
            source={require('../../../assets/icons/nextTrackButton.png')}
          ></Image>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  trackCoverContainer: {
    backgroundColor: 'white',
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
  timersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  trackInfoControlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  trackControlContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButton: {
    width: 60,
    height: 60,
    alignSelf: 'flex-end',
    margin: 15,
  },
  barContainer: {
    height: 20,
    backgroundColor: 'grey',
    borderRadius: 10,
    margin: 10,
  },
  bar: {
    height: 20,
    backgroundColor: 'black',
    borderRadius: 10,
  },
});

export default PlayerScreen;
