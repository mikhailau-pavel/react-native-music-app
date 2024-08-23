import { PlayerScreenProps } from '@/types/types';
import { useRef } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  ScrollView,
  LayoutAnimation,
  Animated as AnimatedRN,
  PanResponder,
  Dimensions,
  PanResponderGestureState,
  GestureResponderEvent,
  Button,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';

const PlayerScreen = ({ route }: PlayerScreenProps) => {
  const pan = useRef(new AnimatedRN.ValueXY()).current;
  const panX = useSharedValue(50);
  const panY = useSharedValue(50);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        //doesn't work with native driver on (not a function)
        // AnimatedRN.event([null, { dx: pan.x, dy: pan.y }], {
        //   useNativeDriver: true,
        // });
        panX.value = event.nativeEvent.locationX
        panY.value = event.nativeEvent.locationY
      },
      onPanResponderRelease: () => {
        pan.extractOffset();
      },
    })
  ).current;
  const handlePress = () => {
    panX.value = panX.value + 5;
    panY.value = panY.value + 5;
  };

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: withSpring(panX.value) },
      { translateY: withSpring(panY.value) },
    ],
  }));
  return (
    <View style={styles.container}>
      <Animated.View style={animatedStyles} {...panResponder.panHandlers}>
        <Button onPress={handlePress} title="Ditch" />
        <Text style={styles.titleText}>Player Screen</Text>
        <View style={styles.box} />
      </Animated.View>
    </View>
    //   const [sound, setSound] = useState<Sound | null>(null);
    //   const [currentTrackInPlaylist, setCurrentTrackInPlaylist] = useState(0);
    //   const [isPlaying, setIsPlaying] = useState(false);
    //   const [playTimeCurrent, setPlayTimeCurrent] = useState(0);
    //   const [expanded, setExpanded] = useState(true);
    //   const [progressBarWidth, setProgressBarWidth] = useState(0);
    //   const progress = useSharedValue(0);
    //   const playlistInfoArr = route.params;
    //   const amountOfTracksInPlaylist = playlistInfoArr.length - 1;
    //   const pan = useRef(new AnimatedRN.ValueXY()).current;

    // const windowHeight = Dimensions.get('screen').height;
  );
  //   const panResponder = useRef(
  //     PanResponder.create({
  //       onMoveShouldSetPanResponder: () => true,
  //       onPanResponderMove: (e, gestureState) => {
  //         console.log('moving')
  //         // console.log('event location X:', e.nativeEvent.locationX)
  //         // console.log('event location Y:', e.nativeEvent.locationY)
  //         // // pan.addListener((value: { x: number; y: number }) => {
  //         // //   console.log('value x', value.x);
  //         // //   console.log('type value x', typeof value.x);
  //         // //   console.log('value y', value.y);
  //         // //   console.log('type value y', typeof value.y);
  //         // // });
  //         // console.log('gesture state:', {
  //         // 'stateID': gestureState.stateID,
  //         // 'the latest screen coordinates of the recently-moved touch(same as native event location)': gestureState.moveX,
  //         // 'the latest screen coordinates of the recently-moved touchY(not the same but has calculable equal gap)': gestureState.moveY,
  //         // 'the screen coordinates of the responder grant(basically first touch)': gestureState.x0,
  //         // 'the screen coordinates of the responder grantY(basically first touch Y)': gestureState.y0,
  //         // 'accumulated distance of the gesture since the touch started': gestureState.dx,
  //         // 'accumulated distance of the gesture since the touch startedY': gestureState.dy,
  //         // 'current velocity of the gesture': gestureState.vx,
  //         // 'current velocity of the gestureY': gestureState.vy,
  //         // 'Number of touches currently on screen': gestureState.numberActiveTouches,
  //         // });
  //         AnimatedRN.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: true });

  //         console.log('moving')
  //       },
  //       onPanResponderRelease: () => {
  //         console.log('stop moving')
  //         pan.extractOffset();
  //         // AnimatedRN.spring(
  //         //   pan,
  //         //   { toValue: { x: 0, y: 0 }, useNativeDriver: true } // Back to zero
  //         // ).start();
  //       },
  //     })
  //   ).current;

  //   useEffect(()=> {
  //     console.log('pan:', pan)
  //   }, [pan])
  //   // console.log('window height:', windowHeight);

  //   // const createPlayback = async (url: string) => {
  //   //   await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
  //   //   const track = await Audio.Sound.createAsync({ uri: url });
  //   //   setSound(track.sound);
  //   //   return track.sound;
  //   // };

  //   // const handlePress = () => {
  //   //   LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  //   //   setExpanded(!expanded);
  //   // };

  //   // useEffect(() => {
  //   //   return sound
  //   //     ? () => {
  //   //         sound.unloadAsync();
  //   //       }
  //   //     : undefined;
  //   // }, [sound]);

  //   // useEffect(() => {
  //   //   if (sound) {
  //   //     sound._onPlaybackStatusUpdate = (playbackStatus) => {
  //   //       if (playbackStatus.isLoaded && playbackStatus.isPlaying && playbackStatus.durationMillis) {
  //   //         const progressConfig = {
  //   //           duration: playbackStatus.durationMillis,
  //   //           dampingRatio: 1,
  //   //           stiffness: 0.1,
  //   //           overshootClamping: false,
  //   //           restDisplacementThreshold: 0.01,
  //   //           restSpeedThreshold: 2,
  //   //           reduceMotion: ReduceMotion.System,
  //   //         };
  //   //         progress.value = withTiming(progressBarWidth, progressConfig);
  //   //         setPlayTimeCurrent(playbackStatus.positionMillis);
  //   //       }
  //   //       if (
  //   //         playbackStatus.isLoaded &&
  //   //         playbackStatus.didJustFinish &&
  //   //         !(currentTrackInPlaylist === amountOfTracksInPlaylist)
  //   //       ) {
  //   //         playNextTrack();
  //   //       }
  //   //     };
  //   //   }
  //   // }, [sound]);

  //   // const playTrack = async () => {
  //   //   if (sound) {
  //   //     setIsPlaying(true);
  //   //     await sound.playAsync();
  //   //   }
  //   // };

  //   // const playNextTrack = async () => {
  //   //   await stopTrack();
  //   //   if (sound) {
  //   //     await sound.unloadAsync();
  //   //     setSound(null);
  //   //   }
  //   //   setCurrentTrackInPlaylist(currentTrackInPlaylist + 1);
  //   //   const nextTrackUrl = route.params[currentTrackInPlaylist + 1].previewUrl;
  //   //   const nextSound = await createPlayback(nextTrackUrl);
  //   //   await nextSound.playAsync();
  //   //   progress.value = 0;
  //   //   setIsPlaying(true);
  //   // };

  //   // const playPreviousTrack = async () => {
  //   //   await stopTrack();
  //   //   if (sound) {
  //   //     await sound.unloadAsync();
  //   //     setSound(null);
  //   //   }
  //   //   setCurrentTrackInPlaylist(currentTrackInPlaylist - 1);
  //   //   const prevTrackUrl = route.params[currentTrackInPlaylist - 1].previewUrl;
  //   //   const prevSound = await createPlayback(prevTrackUrl);
  //   //   await prevSound.playAsync();
  //   //   setIsPlaying(true);
  //   //   progress.value = 0;
  //   // };

  //   // const pauseTrack = async () => {
  //   //   if (sound) await sound.pauseAsync();
  //   //   setIsPlaying(false);
  //   // };

  //   // const stopTrack = async () => {
  //   //   if (sound) await sound.stopAsync();
  //   // };

  //   // const handlePlayButtonPress = async () => {
  //   //   if (!isPlaying) {
  //   //     if (!sound) {
  //   //       const url = route.params[currentTrackInPlaylist].previewUrl;
  //   //       const newTrack = await createPlayback(url);
  //   //       await newTrack.playAsync();
  //   //     } else {
  //   //       await playTrack();
  //   //     }
  //   //     setIsPlaying(true);
  //   //   } else {
  //   //     await pauseTrack();
  //   //     setIsPlaying(false);
  //   //   }
  //   // };
  //   return (
  //     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
  //       <Text style={{ fontSize: 14, lineHeight: 24, fontWeight: 'bold' }}>Drag this box!</Text>
  //       <AnimatedRN.View
  //         style={{
  //           transform: [{ translateX: pan.x }, { translateY: pan.y }],
  //         }}
  //         {...panResponder.panHandlers}
  //       >
  //         <View style={{ height: 150, width: 150, backgroundColor: 'blue', borderRadius: 5 }} />
  //       </AnimatedRN.View>
  //     </View>
  //     // //scale track cover on Android depending on controls availability?
  //     // <ScrollView style={styles.background} {...panResponder.panHandlers}>
  //     //   <View style={styles.trackCoverContainer}>
  //     //     <Text style={styles.trackTitle}>{route.params[currentTrackInPlaylist].artist}</Text>
  //     //     <Image
  //     //       style={styles.trackCover}
  //     //       source={{ height: 300, width: 300, uri: route.params[currentTrackInPlaylist].imageURL }}
  //     //     />
  //     //     <Text style={styles.trackTitle}>{route.params[currentTrackInPlaylist].title}</Text>
  //     //     {!expanded ? (
  //     //       <View style={styles.trackInfoControlContainer}>
  //     //         <TouchableOpacity>
  //     //           <Image
  //     //             style={styles.controlButton}
  //     //             source={require('../../../assets/icons/favButton.png')}
  //     //           ></Image>
  //     //         </TouchableOpacity>
  //     //         <TouchableOpacity>
  //     //           <Image
  //     //             style={styles.controlButton}
  //     //             source={require('../../../assets/icons/loopButton.png')}
  //     //           ></Image>
  //     //         </TouchableOpacity>
  //     //         <TouchableOpacity>
  //     //           <Image
  //     //             style={styles.controlButton}
  //     //             source={require('../../../assets/icons/muteButton.png')}
  //     //           ></Image>
  //     //         </TouchableOpacity>
  //     //         <TouchableOpacity onPress={handlePress}>
  //     //           <Image
  //     //             style={styles.controlButton}
  //     //             source={require('../../../assets/icons/closeButton.png')}
  //     //           ></Image>
  //     //         </TouchableOpacity>
  //     //       </View>
  //     //     ) : (
  //     //       <TouchableOpacity onPress={handlePress}>
  //     //         <Image
  //     //           style={styles.controlButton}
  //     //           source={require('../../../assets/icons/infoButton.png')}
  //     //         ></Image>
  //     //       </TouchableOpacity>
  //     //     )}
  //     //     <View style={styles.timersContainer}>
  //     //       <Text>{`${Math.floor(playTimeCurrent / 1000 / 60)}:${Math.floor((playTimeCurrent / 1000) % 60) < 10 ? '0' : ''}${Math.floor((playTimeCurrent / 1000) % 60)}`}</Text>
  //     //       <Text>0:29</Text>
  //     //     </View>
  //     //     <View
  //     //       style={styles.barContainer}
  //     //       onLayout={(e) => {
  //     //         const { width } = e.nativeEvent.layout;
  //     //         setProgressBarWidth(width);
  //     //       }}
  //     //     >
  //     //       <Animated.View style={[styles.bar, { width: progress }]} />
  //     //     </View>
  //     //   </View>
  //     //   <View style={styles.trackControlContainer}>
  //     //     {!(currentTrackInPlaylist === 0) ? (
  //     //       <TouchableOpacity
  //     //         onPress={() => {
  //     //           if (currentTrackInPlaylist > 0) {
  //     //             playPreviousTrack();
  //     //           } else return;
  //     //         }}
  //     //       >
  //     //         <Image
  //     //           style={[styles.controlButton]}
  //     //           source={require('../../../assets/icons/prevTrackButton.png')}
  //     //         ></Image>
  //     //       </TouchableOpacity>
  //     //     ) : (
  //     //       <Image
  //     //         style={[styles.controlButton, { opacity: 0.3 }]}
  //     //         source={require('../../../assets/icons/prevTrackButton.png')}
  //     //       ></Image>
  //     //     )}
  //     //     <TouchableOpacity onPress={handlePlayButtonPress}>
  //     //       {!isPlaying ? (
  //     //         <Image
  //     //           style={styles.controlButton}
  //     //           source={require('../../../assets/icons/playButton.png')}
  //     //         ></Image>
  //     //       ) : (
  //     //         <Image
  //     //           style={styles.controlButton}
  //     //           source={require('../../../assets/icons/pauseTrackButton.png')}
  //     //         ></Image>
  //     //       )}
  //     //     </TouchableOpacity>
  //     //     {!(currentTrackInPlaylist === amountOfTracksInPlaylist) ? (
  //     //       <TouchableOpacity
  //     //         onPress={() => {
  //     //           if (currentTrackInPlaylist < amountOfTracksInPlaylist) {
  //     //             playNextTrack();
  //     //           } else return;
  //     //         }}
  //     //       >
  //     //         <Image
  //     //           style={styles.controlButton}
  //     //           source={require('../../../assets/icons/nextTrackButton.png')}
  //     //         ></Image>
  //     //       </TouchableOpacity>
  //     //     ) : (
  //     //       <Image
  //     //         style={[styles.controlButton, { opacity: 0.3 }]}
  //     //         source={require('../../../assets/icons/nextTrackButton.png')}
  //     //       ></Image>
  //     //     )}
  //     //   </View>
  //     // </ScrollView>
  //   );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: 'bold',
  },
  box: {
    height: 150,
    width: 150,
    backgroundColor: 'green',
    borderRadius: 5,
  },
});
// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//   },
//   trackCoverContainer: {
//     backgroundColor: 'white',
//     margin: 5,
//   },
//   trackCover: {
//     alignSelf: 'center',
//   },
//   trackTitle: {
//     fontSize: 40,
//     alignSelf: 'center',
//     fontFamily: 'AngemeBold',
//     margin: 5,
//   },
//   timersContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 5,
//   },
//   trackInfoControlContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignContent: 'center',
//   },
//   trackControlContainer: {
//     backgroundColor: 'white',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   controlButton: {
//     width: 60,
//     height: 60,
//     alignSelf: 'flex-end',
//     margin: 15,
//   },
//   barContainer: {
//     height: 20,
//     backgroundColor: 'grey',
//     borderRadius: 10,
//     margin: 10,
//     overflow: 'hidden',
//   },
//   bar: {
//     height: 20,
//     backgroundColor: 'black',
//     borderRadius: 10,
//   },
// });

export default PlayerScreen;
