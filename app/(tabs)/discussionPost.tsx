import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

/**
 * DiscussionPost Component
 *
 * This component provides a form to create a new discussion post.
 * It allows the user to enter a headline (title) and notes (body) for the discussion,
 * and submits the data to a backend server.
 * 
 * **Features**:
 * - Validates required input fields (headline and notes).
 * - Sends a POST request to the server with the discussion data.
 * - Displays a loading indicator while the request is in progress.
 * - Navigates to the Home Page after successfully posting the discussion.
 * - Handles API errors and displays relevant alerts.
 *
 * 
 * @returns {JSX.Element} The rendered DiscussionPost component.
 */
const DiscussionPost = () => {
  /**
   * State to manage the headline (title) input field.
   * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
   */
  const [headline, setHeadline] = useState<string>('');

  /**
   * State to manage the notes (body) input field.
   * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
   */
  const [notes, setNotes] = useState<string>('');

  /**
   * State to manage the loading indicator during the API call.
   * When `loading` is true, a spinner is displayed on the submit button.
   * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * The router instance from Expo Router for navigation between screens.
   */
  const router = useRouter();

  /**
   * The base URL for the backend API endpoint to post discussions.
   * @constant {string}
   */
  const API_URL = 'http://127.0.0.1:8000/discussions/';

  /**
   * Handles the submission of a new discussion post.
   *
   * - Validates that both `headline` and `notes` fields are not empty.
   * - Sends a POST request to the API with the discussion data.
   * - Displays success or error messages based on the API response.
   * - Navigates back to the home page upon successful submission.
   *
   * @async
   * @function addDiscussion
   * @returns {Promise<void>} A promise that resolves when the request is completed.
   */
  const addDiscussion = async (): Promise<void> => {
    // Validate that required fields are not empty
    if (!headline.trim() || !notes.trim()) {
      Alert.alert('Error', 'Both headline and notes are required.');
      return;
    }

    setLoading(true); // Set loading state to true during API call

    try {
      
      const payload = {
        title: headline,
        body: notes,
        user_id: 'sample-user-id', 
      };

      console.log('Sending Payload:', payload);

      // Send the POST request to the API
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Parse the response data
      const responseData = await response.json();

      // Check for server errors
      if (!response.ok) {
        console.error('Server Error:', responseData);
        throw new Error(responseData.error || 'Failed to add discussion');
      }

      // Show success message
      Alert.alert('Success', 'Discussion added successfully!');

      // Reset input fields after successful submission
      setHeadline('');
      setNotes('');

      // Navigate to the Home Page
      router.replace({
        pathname: '/(tabs)/homePage',
      });
    } catch (err) {
      // Handle any errors during the API call
      Alert.alert('Error', err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      // Set loading state back to false
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Form Header */}
      <Text style={styles.headerText}>Add a New Discussion</Text>

      {/* Input for Headline (Title) */}
      <TextInput
        style={styles.input}
        placeholder="Headline"
        value={headline}
        onChangeText={setHeadline}
      />

      {/* Input for Notes (Body) */}
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Notes"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      {/* Submit Button or Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#38b2ac" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={addDiscussion}>
          <Text style={styles.buttonText}>Post</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

/**
 * Styles for the DiscussionPost component.
 * Includes styles for the container, inputs, button, and header text.
 */
const styles = StyleSheet.create({
  /** Container style for the entire form */
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 20,
    justifyContent: 'center',
  },
  /** Header text style for the form */
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  /** Style for text input fields */
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  /** Style for multi-line text area input */
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  /** Style for the submit button */
  button: {
    backgroundColor: '#38b2ac',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  /** Style for the button text */
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DiscussionPost;
