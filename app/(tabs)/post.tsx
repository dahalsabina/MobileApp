import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For icons (e.g., plus sign)
import { useNavigation } from '@react-navigation/native';
import{ ButtonCompo }from '@/components/ButtonCompo';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig';
import { router } from 'expo-router';

const CreatePostScreen: React.FC = () => {
  const navigation = useNavigation(); // Hook for navigation
  const [headline, setHeadline] = useState('');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState<string | null>(null); // Placeholder for image URI
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('Anonymous');

  // Fetch the authorized user's name from the 'users' collection
  useEffect(() => {
    const fetchUserName = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) return;

      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('user_email', '==', currentUser.email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const nameFromDoc = userDoc.data().name;
          if (nameFromDoc) {
            setUserName(nameFromDoc);
          }
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };

    fetchUserName();
  }, []);

  // Function to handle posting to Firebase
  const handlePost = async () => {
    if (!headline.trim() || !notes.trim()) {
      Alert.alert('Error', 'Both headline and notes are required.');
      return;
    }

    setLoading(true);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert('Error', 'No user is currently signed in.');
        setLoading(false);
        return;
      }

      await addDoc(collection(db, 'discussions'), {
        title: headline,
        body: notes,
        user_id: currentUser.uid,
        user_name: userName,
        likes_count: 0,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });

      Alert.alert('Success', 'Post added successfully!');
      setHeadline('');
      setNotes('');
      router.push("./home"); // Navigate back to home screen
    } catch (err) {
      console.error('Error adding post: ', err);
      Alert.alert('Error', err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };






  return (
    <SafeAreaView style={styles.container}>
      {/* Return Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()} // Navigate back
      >
        <Image
          source={require("@/assets/project_images/return.png")} // Replace with the path to your image
          style={styles.returnButtonImage}
        />
      </TouchableOpacity>

      {/* Image Upload Section */}
      <View style={styles.imageSection}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon name="image" size={30} color="#888" />
          </View>
        )}
        <TouchableOpacity style={styles.addImageButton}>
          <Icon name="add" size={30} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Headline Input */}
      <TextInput
        style={styles.headlineInput}
        placeholder="Headline"
        value={headline}
        onChangeText={setHeadline}
      />

      {/* Notes Input */}
      <TextInput
        style={styles.notesInput}
        placeholder="Notes"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      {/* Post Button */}
      <View style={styles.postButton}>
        {loading ? (
          <ActivityIndicator size="large" color="#38b2ac" />
        ) : (
          <ButtonCompo text="Post" onPress={handlePost} />
        )}
      </View>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  returnButtonImage: {
    width: 7.8, 
    height: 13, 
    resizeMode: 'contain', 
    marginLeft: 15,
  },
  imageSection: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headlineInput: {
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginHorizontal: 15,
  },
  notesInput: {
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  postButton: {
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
});

export default CreatePostScreen;