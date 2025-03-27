import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For icons (e.g., plus sign)
import { useNavigation } from '@react-navigation/native';
import{ ButtonCompo }from '@/components/ButtonCompo';

const CreatePostScreen: React.FC = () => {
  const navigation = useNavigation(); // Hook for navigation
  const [headline, setHeadline] = useState('');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState<string | null>(null); // Placeholder for image URI

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
        <ButtonCompo text='Post'></ButtonCompo>
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