import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

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
      if (!email) return;
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('user_email', '==', email));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        const fetchedUserId = userDoc.data().user_id;
        const fetchedUserName = userDoc.data().name;
        setUserId(fetchedUserId);
        setUserName(fetchedUserName);
        fetchDiscussions(fetchedUserId);
      }
    };

    const fetchDiscussions = async (userId: string) => {
      const discussionsRef = collection(db, 'discussions');
      const q = query(discussionsRef, where('user_id', '==', userId));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDiscussions(data);
    };

    fetchUserData();
  }, [email]);

  const posts: Post[] = discussions.map((discussion) => ({
    id: discussion.id,
    username: userName || discussion.user_id,
    content: discussion.body,
    image: '', // optional
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

      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/project_images/profile_minions.jpg')}
          style={styles.profileImage}
        />
        <Text style={styles.welcomeText}>Welcome {userName || 'User'}</Text>
      </View>

      {/* Inline Post Rendering */}
      <ScrollView style={styles.scrollView}>
        {posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <Image
                source={require('../../assets/project_images/profile_minions.jpg')}
                style={styles.postProfileImage}
              />
              <Text style={styles.postUsername}>{post.username}</Text>
            </View>
            <Text style={styles.postContent}>{post.content}</Text>
            <View style={styles.postActions}>
              <Text style={styles.actionText}>❤️ {post.likes}</Text>
              <Text style={styles.actionText}>💬 {post.comments}</Text>
              <Text style={styles.actionText}>🔁 {post.shares}</Text>
            </View>
          </View>
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
    padding: 10,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  postProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postUsername: {
    fontWeight: '600',
    fontSize: 16,
    color: '#1D3557',
  },
  postContent: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionText: {
    fontSize: 14,
    color: '#50C2C9',
  },
});

export default Profile;

