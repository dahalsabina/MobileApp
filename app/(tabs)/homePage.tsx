import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import React from 'react';

const HomePage = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.titleText}>
          This is Home Page
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4', // Light gray background color
    alignItems: 'center' as const, // Ensuring the value type matches FlexAlignType
    justifyContent: 'center' as const, // Ensuring the value type matches FlexAlignType
  },
  content: {
    alignItems: 'center',
    marginBottom: 6,
  },
  titleText: {
    color: '#333', // Darker color for contrast
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomePage;
