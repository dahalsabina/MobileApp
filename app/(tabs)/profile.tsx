import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import PostCardCompo from '../../components/PostCardCompo';

const Profile = () => {
  console.log(require('../../assets/project_images/profile_minions.jpg'));

  return (
    <View style={styles.container}>
      <PostCardCompo
        username="John Blender"
        content="This is a crazily nice day and I am the coolest minion💁🏻‍♀️"
        imageSource={require('../../assets/project_images/profile_minions.jpg')}
        profileImageSource={require('../../assets/project_images/profile_minions.jpg')}
        likes={30500}
        comments={20100}
        shares={3}
      />
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

});
