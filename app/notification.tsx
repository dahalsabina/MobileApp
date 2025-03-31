import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
};

const notifications: NotificationItem[] = [
  {
    id: '1',
    title: 'New Comment on Your Post',
    description: 'Someone commented on your recent discussion.',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    title: 'Welcome to the Discussion App!',
    description: 'Start exploring and sharing your ideas with others.',
    timestamp: '1 day ago',
  },
  {
    id: '3',
    title: 'New Follower',
    description: 'You have a new follower!',
    timestamp: '3 days ago',
  },
];

const NotificationPage = () => {
  const renderNotification = ({ item }: { item: NotificationItem }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationDescription}>{item.description}</Text>
      <Text style={styles.notificationTimestamp}>{item.timestamp}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default NotificationPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  notificationItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 6,
    textAlign: 'right',
  },
});
