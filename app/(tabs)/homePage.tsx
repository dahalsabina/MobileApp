import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';

type Discussion = {
  id: string;
  title: string;
};

const HomePage = () => {
  // Example data for popular discussions
  const discussions: Discussion[] = [
    { id: '1', title: 'What are the best programming languages for 2024?' },
    { id: '2', title: 'Tips for balancing work and study effectively' },
    { id: '3', title: 'Best resources for learning data science' },
  ];

  const renderDiscussion = ({ item }: { item: Discussion }) => (
    <TouchableOpacity style={styles.discussionItem}>
      <Text style={styles.discussionTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Title Section */}
      <View style={styles.header}>
        <Text style={styles.titleText}>Welcome John Doe</Text>
        <Text style={styles.subtitleText}>Engage, explore, and share ideas!</Text>
      </View>

      {/* Popular Discussions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Discussions</Text>
        <FlatList
          data={discussions}
          renderItem={renderDiscussion}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.discussionList}
        />
      </View>

      {/* Call to Action Button */}
      <TouchableOpacity style={styles.startDiscussionButton}>
        <Text style={styles.buttonText}>Start a New Discussion</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitleText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  discussionList: {
    paddingBottom: 20,
  },
  discussionItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  discussionTitle: {
    fontSize: 16,
    color: '#333',
  },
  startDiscussionButton: {
    backgroundColor: '#38b2ac',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
