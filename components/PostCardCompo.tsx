import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import likeIcon from '../assets/project_images/like.png'
import commentIcon from '../assets/project_images/comment.png'
import replyIcon from '../assets/project_images/reply.png'

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
      <View style={styles.footer}>
        <View style={styles.likeContainer}>
          <Image source={replyIcon} style={styles.eachIcon} />
          <Text>{likes}</Text>
        </View>
        <View style={styles.likeContainer}>
          <Image source={commentIcon} style={styles.eachIcon} />
          <Text>{likes}</Text>
        </View>
        <View style={styles.likeContainer}>
          <Image source={likeIcon} style={styles.eachIcon} />
          <Text>{likes}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    maxWidth: 359,
    margin: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  },
  username: {
    fontWeight: 'bold',
  },
  content: {
    marginBottom: 8,
  },
  postImage: {
    width: 335,
    height: 146,
    borderRadius: 8,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
});

export default PostCardCompo;
