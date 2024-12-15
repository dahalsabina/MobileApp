import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export interface ButtonProps {
  /** Used to locate this view in end-to-end tests. */
  testID?: string;
  onPress?: () => void;
  text?: string;
}

export function ButtonCompo({ testID, onPress, text }: ButtonProps) {
  return (
    <TouchableOpacity
      style={styles.root}
      testID={testID ?? '1:353'}
      onPress={onPress}
      activeOpacity={0.8} // Adjusts the opacity effect on press
    >
      <View style={styles.rectangle1} testID="1:354" >
        <Text style={styles.getStarted} testID="1:355">
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  root: {
    width: 352,
    height: 60,
    flexShrink: 0,
  },
  rectangle1: {
    width: 352,
    height: 60,
    flexShrink: 0,
    backgroundColor: 'rgba(80, 194, 201, 1)',
  },
  getStarted: {
    width: 352,
    height: 60,
    flexDirection: 'column',
    justifyContent: 'center',
    flexShrink: 0,
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
    fontFamily: 'SemiBoldPoppins',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 60, // Added for better vertical alignment
  },
});
