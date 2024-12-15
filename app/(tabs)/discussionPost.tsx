import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DiscussionPost = () => {
  const [headline, setHeadline] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);  // For image upload

  const handleImagePick = () => {
    // We can integrate an image picker here.
    // For example, use ImagePicker from Expo to select an image.
  };
  const API_URL = 'https://senior-project-backend-django.onrender.com/discussion_service/discussions';

const addDiscussion = async () => {
  if (!headline.trim() || !notes.trim()) {
    alert('Both headline and notes are required.');
    return;
  }

  setLoading(true);
  try {
   
    const response = await fetch(API_URL, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: headline,
        body: notes
        
      }),
    });

      if (!response.ok) {
        throw new Error('Failed to add discussion');
      }

      setHeadline('');
      setNotes('');
      // setImage(null);  // Clear image
      alert('Discussion added successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.selectedImage} />}
      </View>

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
    backgroundColor: '#fff',
    padding: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePicker: {
    backgroundColor: '#38b2ac',
    borderRadius: 50,
    padding: 20,
    marginBottom: 10,
  },
  selectedImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#38b2ac',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DiscussionPost;
