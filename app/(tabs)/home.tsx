import React, { useState } from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity, Text, SafeAreaView, ScrollView, } from 'react-native';
import PostCardCompo from '../../components/PostCardCompo';

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

const home = () => {
  const [activeTab, setActiveTab] = useState('Follow');

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
      <StatusBar barStyle="dark-content" backgroundColor="#00C4B4" />
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Follow' && styles.activeTab]}
          onPress={() => setActiveTab('Follow')}
        >
          <Text style={[styles.tabText, activeTab === 'Follow' && styles.activeTabText]}>
            Follow
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Explore' && styles.activeTab]}
          onPress={() => setActiveTab('Explore')}
        >
          <Text style={[styles.tabText, activeTab === 'Explore' && styles.activeTabText]}>
            Explore
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Local' && styles.activeTab]}
          onPress={() => setActiveTab('Local')}
        >
          <Text style={[styles.tabText, activeTab === 'Local' && styles.activeTabText]}>
            Local
          </Text>
        </TouchableOpacity>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#50C2C9', 
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: 'white', // White underline for active tab
    
  },
  tabText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: 'white',
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    color: '#666',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#D9D9D9',
  },
});

export default home;