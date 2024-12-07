import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Define the type for a discussion
type Discussion = {
  id: number;
  title: string;
  body: string;
};

const DiscussionDetails = () => {
  const { id } = useLocalSearchParams(); // Retrieve discussion ID from the route
  const [discussion, setDiscussion] = useState<Discussion | null>(null); // Explicitly type the state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // Fetch discussion details from the API
  const fetchDiscussionDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://127.0.0.1:8000/discussions/${id}`);
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
    fetchDiscussionDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4caf50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!discussion) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Discussion not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{discussion.title}</Text>
      <Text style={styles.body}>{discussion.body}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  body: { fontSize: 18, color: '#555' },
  errorText: { fontSize: 16, color: 'red', marginBottom: 10 },
  backButton: {
    marginVertical: 10,
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  backButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default DiscussionDetails;
