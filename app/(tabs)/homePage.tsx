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

/**
 * HomePage component serves as the main landing page of the application.
 * 
 * **Features:**
 * - Fetches a list of discussions from a remote server.
 * - Displays discussions in a scrollable list using React Native's FlatList.
 * - Provides navigation to a detailed view for each discussion using `expo-router`.
 * - Handles loading and error states to enhance user experience.
 * 
 * **API Endpoint:** 
 * Fetches discussions from `http://127.0.0.1:8000/discussions/`.
 *
 * **State Variables:**
 * - `discussions`: Stores the fetched list of discussions.
 * - `loading`: Indicates whether data is being loaded.
 * - `error`: Stores error messages if the fetch operation fails.
 *
 * 
 * @returns {JSX.Element} The rendered homepage component with discussions and navigation.
 */
const HomePage = () => {
  // State to store the fetched discussions
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  // State to manage loading indicator visibility
  const [loading, setLoading] = useState(false);
  // State to manage error messages
  const [error, setError] = useState('');

  /**
   * Fetches discussions from the API and updates the component's state.
   * 
   * **Behavior:**
   * - Initiates a fetch request to the backend API.
   * - On success, updates the `discussions` state with the fetched data.
   * - On failure, captures and sets the error message.
   * 
   * @async
   * @function fetchDiscussions
   * @throws Will throw an error if the API response status is not `200 OK`.
   * @returns {Promise<void>}
   */
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

  /**
   * Runs on component mount to initiate the fetch operation.
   * 
   * This effect ensures that discussions are fetched as soon as the page is loaded.
   * 
   * @function useEffect
   * @dependency []
   */
  useEffect(() => {
    fetchDiscussions();
  }, []);

  /**
   * Renders an individual discussion item in the FlatList.
   * 
   * **Props:**
   * - `item`: A single discussion object containing `id`, `title`, and `body`.
   * 
   * **Navigation:**
   * - Each discussion links to a detailed view via `expo-router`.
   * 
   * @param {Object} param - The props object for the render function.
   * @param {Discussion} param.item - A discussion object with `id`, `title`, and `body`.
   * @returns {JSX.Element} A styled component displaying the discussion title and body.
   */
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
              {/* Displays a loading spinner when discussions are being fetched */}
              {loading && <ActivityIndicator size="large" color="#38b2ac" />}
              {/* Displays an error message if fetching discussions fails */}
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

