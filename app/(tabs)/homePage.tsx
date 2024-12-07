import React, { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';

type Discussion = {
  id: number;
  title: string;
  body: string;
};

const HomePage = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDiscussions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://127.0.0.1:8000/discussions/');
      if (!response.ok) {
        throw new Error('Failed to fetch discussions');
      }
      const data = await response.json();
      setDiscussions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const renderDiscussion = ({ item }: { item: Discussion }) => (
    <View style={styles.discussionItem}>
      <Link
        href={{
          pathname: "/[id]",
          params: { id: item.id.toString() },
        }}
        style={styles.discussionContent}
      >
        <Text style={styles.discussionTitle}>{item.title}</Text>
      </Link>
      <View style={styles.bodyContainer}>
        <Text style={styles.discussionBody}>{item.body}</Text>
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
  discussionContent: { marginBottom: 8 },
  discussionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  bodyContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  discussionBody: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
});

export default HomePage;
