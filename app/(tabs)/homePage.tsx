import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { collection, onSnapshot, query, orderBy } from '@firebase/firestore';

import { db } from '../../firebaseConfig';
import { Link } from "expo-router";


import Ionicons from '@expo/vector-icons/Ionicons'; // or from 'react-native-vector-icons/Ionicons'

/**
 * Discussion type representing the structure of a discussion object.
 */
type Discussion = {
  id: string;
  title: string;
  body: string;
  user_id: string;
  created_at: any;
  updated_at: any;
};

/**
 * HomePage Component
 */
const HomePage = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'discussions'), orderBy('created_at', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedDiscussions: Discussion[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          body: doc.data().body,
          user_id: doc.data().user_id,
          created_at: doc.data().created_at,
          updated_at: doc.data().updated_at,
        }));

        setDiscussions(fetchedDiscussions);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching discussions:', error);
        setError('Failed to load discussions');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /**
   * Renders a single discussion item with navigation to `[id].tsx`
   */
  const renderDiscussion = ({ item }: { item: Discussion }) => (
    <View style={styles.discussionItem}>
      <View style={styles.userRow}>
        <Image
          source={{ uri: 'https://via.placeholder.com/40' }} // Replace with actual user profile image
          style={styles.userImage}
        />
        <Text style={styles.username}>John Blender</Text>
      </View>

      <Link
        href={{
          pathname: '/[id]',
          params: { id: item.id.toString() },
        }}
      >
        <Text style={styles.clickableTitle}>{item.title}</Text>
      </Link>

      <View style={styles.bodyContainer}>
        <Text style={styles.discussionBody}>{item.body}</Text>
      </View>

      {/* Action Buttons (Like, Comment, Share) */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            // Handle Like functionality here
          }}
        >
          <Ionicons name="heart-outline" size={20} color="#50C2C9" />
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            // Handle Comment functionality here
          }}
        >
          <Ionicons name="chatbubble-outline" size={20} color="#50C2C9" />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            // Handle Share functionality here
          }}
        >
          <Ionicons name="share-social-outline" size={20} color="#50C2C9" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Discussions</Text>
      </View>

      {loading && <ActivityIndicator size="large" color="#1D3557" />}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <FlatList
        data={discussions}
        renderItem={renderDiscussion}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContent}
      />
    </SafeAreaView>
  );
};

/**
 * Styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF3F8',
  },
  header: {
    backgroundColor: '#50C2C9', // Keeping the teal color
    paddingVertical: 35,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  discussionItem: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  clickableTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D3557',
    marginBottom: 8,
  },
  bodyContainer: {
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  discussionBody: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 6,
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
  },
  flatListContent: {
    paddingBottom: 100,
    paddingTop: 10,
  },
});

export default HomePage;














