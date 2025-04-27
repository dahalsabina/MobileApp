import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

import divideLine from '../../assets/project_images/line.png';
import likeIcon from '../../assets/project_images/like.png';
import commentIcon from '../../assets/project_images/comment.png';
import replyIcon from '../../assets/project_images/reply.png';

const Content = () => {
  const [comment, setComment] = useState('');
  const navigation = useNavigation();

  const route = useRoute();
  const { post } = route.params;
  console.log('post', post);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Post Header */}
        <View style={styles.postHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.returnButton}>
            <Image
              source={require('@/assets/project_images/return.png')} // Replace with the path to your image
              style={styles.returnButtonImage}
            />
          </TouchableOpacity>
          <Image
            source={require('../../assets/project_images/profile_minions.jpg')}
            style={styles.profileImage}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.username}>{post.username}</Text>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followText}>Follow</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Post Content */}
        <View>
          {post.title ? (
            <Text style={styles.postTitle}>
              {post.title}
            </Text>
          ) : null}
          <Text style={styles.postDescription}>
            <Text>{post.content}</Text>
          </Text>
          <Text style={styles.postFooter}>Last edited: 10-24-2024 Decorah, IA</Text>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <View>
            <Image source={divideLine} style={styles.divideLine} />
          </View>
          <View style={styles.commentContainer}>
            <Image
              source={require('../../assets/project_images/profile_minions.jpg')}
              style={styles.commentProfileImage}
            />
            <View style={styles.commentContent}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentText}>
                  <Text style={styles.commentUsername}>Lorem ipsum dolor </Text>
                  <Text style={styles.authorBadge}>Author</Text>
                </Text>
                <View style={styles.likeButton}>
                  <Image source={likeIcon} style={styles.likeIcon} />
                  <Text style={styles.likeCount}>1</Text>
                </View>
              </View>
              <Text style={styles.commentBody}>
                Lorem ipsum dolor sit amet consectetur.
              </Text>
              <Text style={styles.commentFooter}>
                10-24-2024 LocalState, FlyState <Text style={styles.replyText}>Reply</Text>
              </Text>
            </View>
          </View>
          <View style={styles.replyContainer}>
            <Image
              source={require('../../assets/project_images/profile_minions.jpg')}
              style={styles.replyProfileImage}
            />
            <View style={styles.replyContent}>
              <Text style={styles.commentText}>
                <Text style={styles.commentUsername}>Lorem ipsum dolor </Text>
              </Text>
              <Text style={styles.commentBody}>
                Lorem ipsum dolor sit amet consectetur.
              </Text>
              <Text style={styles.commentFooter}>
                10-24-2024 LocalState, FlyState <Text style={styles.replyText}>Reply</Text>
              </Text>
            </View>
          </View>
          <Text style={styles.viewReplies}>- View 11 replies</Text>
          <View style={styles.commentContainer}>
            <Image
              source={require('../../assets/project_images/profile_minions.jpg')}
              style={styles.commentProfileImage}
            />
            <View style={styles.commentContent}>
              <Text style={styles.commentText}>
                <Text style={styles.commentUsername}>Lorem ipsum dolor </Text>
              </Text>
              <Text style={styles.commentBody}>
                Lorem ipsum dolor sit amet consectetur.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add Comment and Actions */}
      <View style={styles.addCommentSection}>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Image source={replyIcon} style={styles.actionIcon} />
            <Text style={styles.actionText}>{post.shares}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Image source={likeIcon} style={styles.actionIcon} />
            <Text style={styles.actionText}>{post.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Image source={commentIcon} style={styles.actionIcon} />
            <Text style={styles.actionText}>{post.commentsCount}</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          value={comment}
          onChangeText={setComment}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  returnButton: {
    marginRight: 10,
  },
  returnButtonImage: {
    width: 9,
    height: 15,
    resizeMode: 'contain',
  },
  profileImage: {
    width: 34,
    height: 34,
    borderRadius: 25,
  },
  headerTextContainer: {
    marginLeft: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  followButton: {
    backgroundColor: '#50C2C9',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  followText: {
    color: '#fff',
    fontSize: 14,
  },
  postImage: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  postDescription: {
    fontSize: 14,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  tags: {
    fontSize: 14,
    color: '#50C2C9',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  postFooter: {
    fontSize: 12,
    color: '#888',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  commentsSection: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  commentText: {
    fontSize: 14,
    marginVertical: 5,
  },
  authorText: {
    fontWeight: 'bold',
    color: '#50C2C9',
  },
  commentReply: {
    fontSize: 12,
    color: '#50C2C9',
    marginVertical: 5,
  },
  addCommentSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  divideLine: {
    width: 345,
    height: 1,
    marginTop: 4,
    // marginBottom: 4
  },
  commentContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  commentProfileImage: {
    width: 34,
    height: 34,
    borderRadius: 20,
  },
  commentContent: {
    marginLeft: 10,
    flex: 1,
  },
  commentUsername: {
    fontWeight: 'bold',
  },
  commentBody: {
    fontSize: 14,
    color: '#333',
  },
  commentFooter: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  replyText: {
    color: '#50C2C9',
    fontWeight: 'bold',
  },
  replyContainer: {
    flexDirection: 'row',
    marginLeft: 50,
    marginVertical: 10,
  },
  replyProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  replyContent: {
    marginLeft: 10,
    flex: 1,
  },
  viewReplies: {
    color: '#50C2C9',
    fontSize: 12,
    marginLeft: 50,
    marginVertical: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  actionIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#000',
  },
  authorBadge: {
    backgroundColor: '#50C2C9',
    color: '#fff',
    fontSize: 12,
    paddingHorizontal: 5,
    borderRadius: 5, // Increased borderRadius for rounder corners
    marginLeft: 5,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likeButton: {
    alignItems: 'center', // Center the icon and count
    justifyContent: 'center',
  },
  likeIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginBottom: 2, // Add spacing between the icon and the count
  },
  likeCount: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  
});

export default Content;