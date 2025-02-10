import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

export interface InputProps {
  /** Used to locate this view in end-to-end tests. */
  testID?: string;
  text?: string;
  curValue?: string;
  curChange?: (text: string) => void;
}

export function InputCompo({ testID, text, curValue, curChange}: InputProps) {
  return (
    <View style={styles.root} testID={testID ?? '1:9'}>
      <View style={styles.rectangle2} testID="1:10" />
      <TextInput 
      style={styles.enterInfo} testID="1:11"
      placeholder={text}
      keyboardType='email-address'
      autoCapitalize='none'
      value={curValue}
      onChangeText={curChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: 352,
    height: 50,
    flexShrink: 0,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  rectangle2: {
    width: 352,
    height: 50,
    borderRadius: 100, // Optimized with single borderRadius property
    backgroundColor: 'rgba(255, 254, 254, 1)',
  },
  enterInfo: {
    position: 'absolute', // Position the text over the rectangle
    color: 'rgba(0, 0, 0, 0.78)',
    fontFamily: 'Poppins',
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: '400',
    textAlign: 'left',
    marginLeft: 26,
  },
});
