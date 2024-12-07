import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

const Profile = () => {
  return (
    <View style={styles.container}>
      {/* Profile Picture */}
      <Image
        source={{ uri: 'https://via.placeholder.com/120' }} 
        style={styles.profileImage}
      />

      {/* User Information */}
      <Text style={styles.name}>John Doe</Text>
      <Text style={styles.bio}>
        Passionate software engineer with a love for creating beautiful and functional mobile apps. Always learning and growing!
      </Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonSecondary]}>
          <Text style={[styles.buttonText, styles.buttonSecondaryText]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4', // Light grey background
    alignItems: 'center',
    justifyContent: 'space-around', // Adjusted to space out content more
    padding: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 30,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333', // Darker grey for main text color
    marginTop: 10,
  },
  bio: {
    fontSize: 14,
    color: '#666', // Medium grey for bio text color
    textAlign: 'center',
    marginHorizontal: 20,
    lineHeight: 22,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#38b2ac', // Teal color for primary button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#ffffff', // White text for buttons
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonSecondary: {
    backgroundColor: '#ddd', // Light grey for secondary button background
  },
  buttonSecondaryText: {
    color: '#333', // Dark grey for secondary button text color
  },
});
