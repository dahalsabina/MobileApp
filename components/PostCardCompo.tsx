import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import likeIcon from '../assets/project_images/like.png'
import commentIcon from '../assets/project_images/comment.png'
import replyIcon from '../assets/project_images/reply.png'
import divideLine from '../assets/project_images/line.png'

interface PostCardProps {
  username?: string;
  content?: string;
  imageSource?: string;
  profileImageSource?: string;
  likes?: number;
  comments?: number;
  shares?: number;
}

export function PostCardCompo ({ username, content, imageSource, likes, comments, shares, profileImageSource }: PostCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Image source={profileImageSource} style={styles.avatarImage} />
        </View>
        <Text style={styles.username}>{username}</Text>
      </View>
      <Text style={styles.content}>{content}</Text>
      <Image source={imageSource} style={styles.postImage} />
      <View>
        <Image source={divideLine} styles={styles.divideLine} />
      </View>
      <View style={styles.footer}>
        <View style={styles.likeContainer}>
          <Image source={replyIcon} style={styles.eachIcon} />
          <Text>{shares}</Text> // add click
        </View>
        <View style={styles.likeContainer}>
          <Image source={commentIcon} style={styles.eachIcon} />
          <Text>{comments}</Text> // add click
        </View>
        <View style={styles.likeContainer}>
          <Image source={likeIcon} style={styles.eachIcon} />
          <Text>{likes}</Text> // add click
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 13,
    padding: 7.5, // base padding, others should calcualte and mins this
    maxWidth: 359,
    marginVertical: 4, // Space between cards vertically
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#EEEEEE', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.5, // Shadow opacity
    shadowRadius: 4, // Shadow blur radius
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 6.5,
    marginLeft: 4.5
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: 20,
    backgroundColor: '#ddd',
    marginRight: 6,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    // marginTop: 
  },
  username: {
    fontWeight: 'bold',
  },
  content: {
    marginBottom: 8,
    marginLeft: 4.5
  },
  postImage: {
    width: 335,
    height: 146,
    borderRadius: 8,
    marginBottom: 8,
    alignSelf: 'center',
  },
  divideLine: {
    width: 345,
    height: 1,
    marginTop: 4,
    // marginBottom: 4
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 4.5,
    marginRight: 4.5,
  },
  icon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eachIcon: {
    width: 21,
    height: 19.5,
    marginRight: 4,
    marginTop: 4,
    // marginBottom: 7.5,
  },
});

export default PostCardCompo;
