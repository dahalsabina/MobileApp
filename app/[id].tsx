import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';

type Discussion = {
  id: number;
  title: string;
  body: string;
};

const DiscussionDetails = () => {
  const { id } = useLocalSearchParams();
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const fetchDiscussionDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const API_URL = `http://127.0.0.1:8000/discussions/${id}`;
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to load discussion details');
      }
      const data: Discussion = await response.json();
      setDiscussion(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDiscussionDetails();
    } else {
      setError('Discussion ID is missing.');
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (discussion?.title) {
      navigation.setOptions({ title: discussion.title });
    }
  }, [discussion]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#38b2ac" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!discussion) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Discussion not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>{discussion.title}</Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.discussionBody}>{discussion.body}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef2f3', padding: 16 },
  header: { alignItems: 'center', marginBottom: 20 },
  titleText: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50' },
  bodyContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  discussionBody: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: { color: 'red', fontSize: 16, marginBottom: 10 },
});

export default DiscussionDetails;



  
    

      