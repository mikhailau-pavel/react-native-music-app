import { ActivityItemProps } from '@/utils/constants';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityItem } from './activityItem';

const LoadingIndicator = () => {
  return (
    <View style={styles.container}>
      {ActivityItemProps.map((item, index) => (
        <ActivityItem rotate={item.rotate} delay={item.delay} key={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingIndicator;
