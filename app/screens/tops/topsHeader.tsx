import { useTheme } from "@react-navigation/native";
import { View, Pressable, Text } from "react-native";
import { getStyles } from "./styles";
import { TopsChartType, TopsHeaderProps } from "@/types/types";

export const TopsHeader = ({type, period, updateChartType, updatePeriod}: TopsHeaderProps)=> {
  const { colors } = useTheme()
  const styles = getStyles(colors)


  return (<View style={styles.topsTopBarContainer}>
    <View style={styles.topsTopBarTypeContainer}>
      <Pressable
        style={[
          styles.topsTopBarTypeButton,
          type === 'artists' ? styles.activeTypeButton : null,
        ]}
        onPressIn={() => {
          updateChartType('artists');
        }}
      >
        <Text style={styles.buttonText}>Artists</Text>
      </Pressable>
      <Pressable
        style={[
          styles.topsTopBarTypeButton,
          type === 'tracks' ? styles.activeTypeButton : null,
        ]}
        onPressIn={() => {
          updateChartType('tracks');
        }}
      >
        <Text style={styles.buttonText}>Tracks</Text>
      </Pressable>
    </View>
    <View style={styles.topsTopBarPeriodContainer}>
      <Pressable
        style={[
          styles.topsTopBarPeriodButton,
          period === 'short_term' ? styles.activePeriodButton : null,
        ]}
        onPressIn={() => {
          updatePeriod('short_term');
        }}
      >
        <Text style={styles.buttonText}>4 weeks</Text>
      </Pressable>
      <Pressable
        style={[
          styles.topsTopBarPeriodButton,
          period === 'medium_term' ? styles.activePeriodButton : null,
        ]}
        onPressIn={() => {
          updatePeriod('medium_term');
        }}
      >
        <Text style={styles.buttonText}>6 months</Text>
      </Pressable>
      <Pressable
        style={[
          styles.topsTopBarPeriodButton,
          period === 'long_term' ? styles.activePeriodButton : null,
        ]}
        onPressIn={() => {
          updatePeriod('long_term');
        }}
      >
        <Text style={styles.buttonText}>All time</Text>
      </Pressable>
    </View>
  </View>)
}