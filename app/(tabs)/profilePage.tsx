import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import PostCardCompo from '../../components/PostCardCompo';
import postIcon from '../../assets/project_images/post.png'
import profileIcon from '../../assets/project_images/profile.png'
import exploreIcon from '../../assets/project_images/explore.png'
import homeIcon from '../../assets/project_images/home.png'



// Define types for the post data
interface Post {
  id: string;
  username: string;
  content: string;
  image: string;
  shares: number;
  comments: number;
  likes: number;
}

const Profile = () => {
  // Sample post data
  const posts: Post[] = [
    {
      id: '1',
      username: 'John Blender',
      content: 'This is a crazly nice day with all the people coming over to see this event.',
      // todo: pull from database the images
      image: '',
      shares: 3,
      comments: 20,
      likes: 321,
    },
    {
      id: '2',
      username: 'John Blender',
      content: 'This is a crazly nice day with all the people coming over to see this event.',
      // todo: pull from database the images
      image: '',
      shares: 3,
      comments: 20,
      likes: 321,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Image 
        source={require("@/assets/project_images/shape.png")}
        style={styles.twoCirclesBackground}
      />
      <StatusBar barStyle="dark-content" backgroundColor="#000" />
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/project_images/profile_minions.jpg')} 
          style={styles.profileImage}
        />
        <Text style={styles.welcomeText}>Welcome John Blender</Text>
      </View>

      {/* Post List */}
      <ScrollView style={styles.scrollView}>
        {posts.map((post) => (
          <PostCardCompo
            username={post.username}
            content={post.content}
            imageSource={
              post.image.startsWith('http')
                ? { uri: post.image }
                : require('../../assets/project_images/profile_minions.jpg')
            }
            profileImageSource={post.image.startsWith('http')
              ? { uri: post.image }
              : require('../../assets/project_images/profile_minions.jpg')}
            likes={post.likes}
            comments={post.comments}
            shares={post.shares}
          />
        ))}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Image source={homeIcon} style={styles.navImageIconHome} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
        <Image source={postIcon} style={styles.navImageIconPost} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
        <Image source={exploreIcon} style={styles.navImageIconExplore} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
        <Image source={profileIcon} style={styles.navImageIconProfile} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#50C2C9',
  },
  twoCirclesBackground: {
    position: 'absolute',
    // zIndex: 1, 
  },
  header: {
    backgroundColor: '#50C2C9',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
    // borderWidth: 1,
    // borderColor: '#50C2C9',
  },
  welcomeText: {
    fontSize: 17,
    // fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#D9D9D9',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#50C2C9',
    // paddingVertical: 10,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
  },
  navButton: {
    padding: 10,
  },
  navImageIconHome: {
    width: 25, // Adjust width for image icons
    height: 19.4, // Adjust height for image icons
  },
  navImageIconPost: {
    width: 21.875, // Adjust width for image icons
    height: 21.875, // Adjust height for image icons
  },
  navImageIconExplore: {
    width: 16, // Adjust width for image icons
    height: 25, // Adjust height for image icons
  },
  navImageIconProfile: {
    width: 24.2, // Adjust width for image icons
    height: 24.2, // Adjust height for image icons
  },
});

export default Profile;