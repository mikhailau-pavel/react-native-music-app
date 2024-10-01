import { View, Text, StyleSheet } from 'react-native';

export const EmptyQueueComponent = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: '#fff',
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Queue is empty</Text>
    </View>
  );
};
