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
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
} from '@firebase/firestore';
import { db, auth } from '../../firebaseConfig'; // Import Firestore & Auth

const DiscussionPost = () => {
  const [headline, setHeadline] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  /**
   * Handles the submission of a new discussion post to Firestore.
   */
  const addDiscussion = async (): Promise<void> => {
    if (!headline.trim() || !notes.trim()) {
      Alert.alert('Error', 'Both headline and notes are required.');
      return;
    }

    setLoading(true);

    try {
      // Ensure the user is signed in
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert('Error', 'No user is currently signed in.');
        setLoading(false);
        return;
      }

      // Fetch the user's name from the 'users' collection
      let userName = 'Anonymous'; // Fallback if not found
      const usersRef = collection(db, 'users');
      // You can match by user_id (UID) or user_email. Below matches by email:
      const q = query(usersRef, where('user_email', '==', currentUser.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        userName = userDoc.data().name || 'Anonymous';
      }

      // Now create the discussion document in Firestore
      await addDoc(collection(db, 'discussions'), {
        title: headline,
        body: notes,
        user_id: currentUser.uid, // store the UID for reference
        user_name: userName,      // store the name from the 'users' collection
        likes_count: 0,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });

      Alert.alert('Success', 'Discussion added successfully!');
      setHeadline('');
      setNotes('');
      // Navigate back to home screen (adjust path as needed)
      router.replace('/(tabs)/home');
    } catch (err) {
      console.error('Error adding discussion: ', err);
      Alert.alert(
        'Error',
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Add a New Discussion</Text>

      <TextInput
        style={styles.input}
        placeholder="Headline"
        value={headline}
        onChangeText={setHeadline}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Notes"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 20,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#38b2ac',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DiscussionPost;

