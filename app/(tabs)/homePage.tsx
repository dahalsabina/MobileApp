import React, { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Icons for like, comment, and share

type Discussion = {
  id: string;
  discussion_id: string;
  title: string;
  body: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  likes?: number;
};

const HomePage = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = 'https://senior-project-backend-django.onrender.com/discussion_service/discussions';

  const fetchDiscussions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch discussions');
      }
      const data = await response.json();

      // Initialize likes for posts
      const processedData = data.map((item: any, index: number) => ({
        ...item,
        id: item.discussion_id || `temp-id-${index}`,
        likes: Math.floor(Math.random() * 100), // Random initial likes
      }));

      setDiscussions(processedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const handleLike = (id: string) => {
    setDiscussions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, likes: (item.likes || 0) + 1 } : item
      )
    );
  };

  const renderDiscussion = ({ item }: { item: Discussion }) => (
    <View style={styles.discussionItem}>
      {/* Header: Post Title */}
      <View style={styles.headerRow}>
        <Text style={styles.discussionTitle}>{item.title}</Text>
      </View>

      {/* Body: Post Content */}
      <View style={styles.bodyContainer}>
        <Text style={styles.discussionBody}>{item.body}</Text>
      </View>

      {/* Footer: Like, Comment, Share */}
      <View style={styles.footerRow}>
        <TouchableOpacity onPress={() => handleLike(item.id)} style={styles.iconButton}>
          <Ionicons name="heart-outline" size={24} color="#e74c3c" />
          <Text style={styles.footerText}>{item.likes || 0} Likes</Text>
        </TouchableOpacity>

        <Link
          href={{
            pathname: "/[id]",
            params: { id: item.id.toString() },
          }}
          style={styles.iconButton}
        >
          <Ionicons name="chatbubble-outline" size={24} color="#3498db" />
          <Text style={styles.footerText}>Comment</Text>
        </Link>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="share-outline" size={24} color="#2ecc71" />
          <Text style={styles.footerText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={discussions}
        renderItem={renderDiscussion}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.flatListContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.titleText}>Welcome to the Feed</Text>
            <Text style={styles.subtitleText}>Explore discussions from everyone!</Text>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Discussions</Text>
              {loading && <ActivityIndicator size="large" color="#38b2ac" />}
              {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef2f3' },
  header: { alignItems: 'center', marginBottom: 20 },
  titleText: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50' },
  subtitleText: { color: '#7f8c8d', fontSize: 16, marginTop: 5, textAlign: 'center' },
  section: { marginBottom: 10, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#38b2ac', marginBottom: 10 },
  errorText: { color: 'red', marginBottom: 10 },
  flatListContent: { paddingHorizontal: 16, paddingBottom: 20 },
  discussionItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  discussionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  bodyContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    marginBottom: 10,
  },
  discussionBody: { fontSize: 16, color: '#555', lineHeight: 22 },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: { marginLeft: 5, fontSize: 14, color: '#555' },
});

export default HomePage;


