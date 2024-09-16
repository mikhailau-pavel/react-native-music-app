import { useTheme } from '@react-navigation/native';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const PlaylistItem = ({ item }) => {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.border,
    },
    playingItemAlbumImage: {
      width: 50,
      height: 50,
      marginRight: 10,
      borderRadius: 5,
    },
    trackInfo: {},
    trackTitle: {
      color: colors.text,
      fontSize: 16,
      fontFamily: 'AngemeBold',
    },
    trackArtist: {
      color: colors.text,
      fontSize: 14,
      fontFamily: 'AngemeRegular',
    },
  });

  return (
    <TouchableOpacity>
      <View style={styles.container}>
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {item.song}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {item.artist}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PlaylistItem;
