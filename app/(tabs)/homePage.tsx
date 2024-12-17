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

/**
 * Discussion type representing the structure of a discussion object.
 * 
 * @typedef {Object} Discussion
 * @property {string} id - Unique identifier for the discussion (used locally).
 * @property {string} discussion_id - The actual discussion ID from the server.
 * @property {string} title - Title of the discussion.
 * @property {string} body - Content/body of the discussion.
 * @property {string} user_id - User ID who created the discussion.
 * @property {string} created_at - Date and time when the discussion was created.
 * @property {string} updated_at - Date and time when the discussion was last updated.
 */
type Discussion = {
  id: string;
  discussion_id: string;
  title: string;
  body: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

/**
 * HomePage Component
 *
 * This component displays a list of discussions fetched from the backend API.
 * 
 * **Features**:
 * - Fetches discussions from the backend API on component mount.
 * - Displays a list of discussions with their title and content.
 * - Allows navigation to a detailed view of a discussion via clickable titles.
 * - Handles loading and error states.
 * 
 * @component
 * @returns {JSX.Element} The rendered HomePage component.
 */
const HomePage = () => {
  /**
   * State to store the fetched list of discussions.
   * @type {[Discussion[], React.Dispatch<React.SetStateAction<Discussion[]>>]}
   */
  const [discussions, setDiscussions] = useState<Discussion[]>([]);

  /**
   * State to handle the loading indicator during API fetch.
   * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
  const [loading, setLoading] = useState(false);

  /**
   * State to store error messages if the fetch operation fails.
   * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
   */
  const [error, setError] = useState('');

  /**
   * Base URL for the API endpoint.
   * @constant {string}
   */
  const API_URL = 'http://127.0.0.1:8000/';

  /**
   * Fetches the list of discussions from the backend server.
   *
   * - Sends a GET request to retrieve all discussions.
   * - Processes the data to ensure each discussion has a unique `id`.
   * - Updates the state with fetched data or sets an error message.
   *
   * @async
   * @function fetchDiscussions
   * @returns {Promise<void>} A promise that resolves after fetching the discussions.
   */
  const fetchDiscussions = async (): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/discussions/`);
      if (!response.ok) {
        throw new Error('Failed to fetch discussions');
      }
      const data = await response.json();

      // Ensure each discussion has a valid `id` property
      const processedData = data.map((item: any, index: number) => ({
        ...item,
        id: item.discussion_id || `temp-id-${index}`,
      }));

      setDiscussions(processedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches discussions when the component mounts.
   */
  useEffect(() => {
    fetchDiscussions();
  }, []);

  /**
   * Renders a single discussion item in the list.
   *
   * @param {Object} param - The props object for the render function.
   * @param {Discussion} param.item - The discussion object to render.
   * @returns {JSX.Element} A rendered discussion item component.
   */
  const renderDiscussion = ({ item }: { item: Discussion }) => (
    <View style={styles.discussionItem}>
      {/* Clickable Title that navigates to the detailed discussion page */}
      <Link
        href={{
          pathname: '/[id]',
          params: { id: item.id.toString() },
        }}
        style={styles.discussionTitle}
      >
        <Text style={styles.clickableTitle}>{item.title}</Text>
      </Link>

      {/* Body: Post Content */}
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

/**
 * Styles for the HomePage component.
 */
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
  discussionTitle: { marginBottom: 8 },
  clickableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498db',
    textDecorationLine: 'underline',
  },
  bodyContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    marginBottom: 10,
  },
  discussionBody: { fontSize: 16, color: '#555', lineHeight: 22 },
});

export default HomePage;




