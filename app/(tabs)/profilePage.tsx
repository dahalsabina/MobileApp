import React, { useEffect, useState } from 'react';
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
import { useLocalSearchParams } from 'expo-router';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig'; // Ensure your Firestore instance is imported

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
  const { email } = useLocalSearchParams();

  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [discussions, setDiscussions] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!email) return;

        // Reference the Firestore collection for users
        const usersRef = collection(db, 'users');

        // Query Firestore for the document with the matching email
        const q = query(usersRef, where('user_email', '==', email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Assuming there's only one document per email
          const userDoc = querySnapshot.docs[0];
          const fetchedUserId = userDoc.data().user_id;
          const fetchedUserName = userDoc.data().name; // Get the user's name
          setUserId(fetchedUserId);
          setUserName(fetchedUserName);

          // Fetch discussions for the user
          fetchDiscussions(fetchedUserId);
        } else {
          console.log('No user found with the provided email.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchDiscussions = async (userId: string) => {
      try {
        // Reference the Firestore collection for discussions
        const discussionsRef = collection(db, 'discussions');

        // Query Firestore for discussions with the matching user_id
        const q = query(discussionsRef, where('user_id', '==', userId));
        const querySnapshot = await getDocs(q);

        const userDiscussions = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDiscussions(userDiscussions);
      } catch (error) {
        console.error('Error fetching discussions:', error);
      }
    };

    fetchUserData();
  }, [email]);

  // Transform discussions into posts
  const posts: Post[] = discussions.map((discussion) => ({
    id: discussion.id,
    username: discussion.user_id, // this field could also be replaced with the user's name if stored in discussion
    content: discussion.body,
    image: '', // default placeholder
    shares: 0,
    comments: 0,
    likes: discussion.likes_count,
  }));

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
        <Text style={styles.welcomeText}>
          Welcome {userName || 'User'}
        </Text>
      </View>

      {/* Post List */}
      <ScrollView style={styles.scrollView}>
        {posts.map((post) => (
          <PostCardCompo
            key={post.id}
            username={post.username}
            content={post.content}
            imageSource={
              post.image.startsWith('http')
                ? { uri: post.image }
                : require('../../assets/project_images/profile_minions.jpg')
            }
            profileImageSource={
              post.image.startsWith('http')
                ? { uri: post.image }
                : require('../../assets/project_images/profile_minions.jpg')
            }
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
    backgroundColor: '#50C2C9',
  },
  twoCirclesBackground: {
    position: 'absolute',
    zIndex: 1,
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
  },
  welcomeText: {
    fontSize: 17,
    color: '#FFFFFF',
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#D9D9D9',
  },
});

export default Profile;
