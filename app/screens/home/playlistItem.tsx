import { PlaylistItemProps } from "@/types/types";
import { useTheme } from "@react-navigation/native";
import { TouchableOpacity, View, Image, Text } from "react-native";
import { getStyles } from "./styles";

export const PlaylistItem = ({
  item,
  onPress,
  isSelected,
}: PlaylistItemProps & { isSelected: boolean }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.item, isSelected && { backgroundColor: '#017371' }]}
    >
      <View style={styles.itemContent}>
        <Image source={{ uri: item.imageURL }} style={styles.itemImage} />
        <Text style={[styles.title, isSelected && { color: '#FFFFFF' }]}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );
};