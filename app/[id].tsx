import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';

/**
 * Discussion type representing the shape of a discussion object.
 * 
 * @typedef {Object} Discussion
 * @property {number} id - Unique identifier for the discussion.
 * @property {string} title - Title of the discussion.
 * @property {string} body - Body content of the discussion.
 */
type Discussion = {
  id: number;
  title: string;
  body: string;
};

/**
 * DiscussionDetails Component
 *
 * This component displays the details of a specific discussion post.
 * 
 * **Features**:
 * - Fetches discussion details using a unique ID from the backend API.
 * - Handles loading and error states gracefully.
 * - Updates the navigation header with the discussion title.
 * 
 * @component
 * @returns {JSX.Element} The rendered DiscussionDetails component.
 */
const DiscussionDetails = () => {
  /**
   * Extract the `id` parameter from the route using expo-router.
   * @constant {Object} useLocalSearchParams
   */
  const { id } = useLocalSearchParams();

  /**
   * State to store the fetched discussion details.
   * @type {[Discussion | null, React.Dispatch<React.SetStateAction<Discussion | null>>]}
   */
  const [discussion, setDiscussion] = useState<Discussion | null>(null);

  /**
   * State to handle the loading indicator during API fetch.
   * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * State to store error messages if the API fetch fails.
   * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
   */
  const [error, setError] = useState<string>('');

  /**
   * Navigation instance to manipulate the header title dynamically.
   * @constant {Object} useNavigation
   */
  const navigation = useNavigation();

  /**
   * Fetches discussion details from the backend server.
   * 
   * - Sends a GET request to retrieve details for a specific discussion ID.
   * - Updates the state with fetched data or sets an error message if the request fails.
   * 
   * @async
   * @function fetchDiscussionDetails
   * @returns {Promise<void>} A promise that resolves after fetching the discussion.
   */
  const fetchDiscussionDetails = async (): Promise<void> => {
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

  /**
   * Fetches the discussion details on component mount or when `id` changes.
   */
  useEffect(() => {
    if (id) {
      fetchDiscussionDetails();
    } else {
      setError('Discussion ID is missing.');
      setLoading(false);
    }
  }, [id]);

  /**
   * Updates the navigation header with the discussion title if available.
   */
  useEffect(() => {
    if (discussion?.title) {
      navigation.setOptions({ title: discussion.title });
    }
  }, [discussion]);

  /**
   * Renders a loading spinner while data is being fetched.
   */
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#38b2ac" />
      </View>
    );
  }

  /**
   * Renders an error message if the data fails to load.
   */
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  /**
   * Renders a message when the discussion data is empty.
   */
  if (!discussion) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Discussion not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.titleText}>{discussion.title}</Text>
      </View>

      {/* Body Content */}
      <View style={styles.bodyContainer}>
        <Text style={styles.discussionBody}>{discussion.body}</Text>
      </View>
    </View>
  );
};

/**
 * Styles for the DiscussionDetails component.
 */
const styles = StyleSheet.create({
  /** Main container for the page */
  container: { flex: 1, backgroundColor: '#eef2f3', padding: 16 },
  /** Header style for the title section */
  header: { alignItems: 'center', marginBottom: 20 },
  /** Title text style */
  titleText: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50' },
  /** Body container for the discussion details */
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
  /** Body text style */
  discussionBody: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  /** Centered container for loading and error states */
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  /** Error text style */
  errorText: { color: 'red', fontSize: 16, marginBottom: 10 },
});

export default DiscussionDetails;




  
    

      