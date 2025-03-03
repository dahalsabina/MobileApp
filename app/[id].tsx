import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  doc,
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  addDoc,
  serverTimestamp,
} from '@firebase/firestore';
import { db } from '../firebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams as useSearchParams } from 'expo-router';

const { id } = useSearchParams();


type Discussion = {
  id: string;
  title: string;
  body: string;
  user_id: string;
  created_at: any;
  updated_at: any;
};

type Comment = {
  id: string;
  content: string;       // Matches your Firestore field
  user_id: string;
  created_at: any;
  discussion_id: string; // Ties the comment to a discussion
};

const DiscussionDetail = () => {
  // Get the discussion id from the route parameters.
  const { id } = useSearchParams();
  const discussionId = id as string;

  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (!discussionId) return;

    // 1. Subscribe to the discussion document in 'discussions' collection
    //    (Only if you store your discussion data here).
    const discussionRef = doc(db, 'discussions', discussionId);
    const unsubscribeDiscussion = onSnapshot(
      discussionRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setDiscussion({
            id: docSnapshot.id,
            ...(docSnapshot.data() as Omit<Discussion, 'id'>),
          });
        } else {
          setError('Discussion not found');
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error loading discussion:', err);
        setError('Failed to load discussion');
        setLoading(false);
      }
    );

    // 2. Subscribe to the top-level 'Comment' collection
    //    where 'discussion_id' == discussionId
    const commentsRef = collection(db, 'Comment');
    const commentsQuery = query(
      commentsRef,
      where('discussion_id', '==', discussionId),
      orderBy('created_at', 'asc')
    );
    const unsubscribeComments = onSnapshot(
      commentsQuery,
      (snapshot) => {
        const fetchedComments: Comment[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Comment, 'id'>),
        }));
        setComments(fetchedComments);
      },
      (err) => {
        console.error('Error fetching comments:', err);
      }
    );

    return () => {
      unsubscribeDiscussion();
      unsubscribeComments();
    };
  }, [discussionId]);

  // 3. Function to add a comment to the top-level 'Comment' collection
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await addDoc(collection(db, 'Comment'), {
        content: newComment,
        user_id: 'currentUserId', // Replace with your actual user ID.
        discussion_id: discussionId,
        created_at: serverTimestamp(),
      });
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  // If still loading discussion data
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#1D3557" />
      </SafeAreaView>
    );
  }

  // If there's an error or no discussion found
  if (error || !discussion) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error || 'Discussion not found'}</Text>
      </SafeAreaView>
    );
  }

  // Render each comment
  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <Text style={styles.commentText}>{item.content}</Text>
      {item.created_at && (
        <Text style={styles.commentDate}>
          {new Date(item.created_at.seconds * 1000).toLocaleString()}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Discussion details + Like / Share */}
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContent}
        ListHeaderComponent={
          <View style={styles.discussionDetail}>
            <View style={styles.userRow}>
              <Image
                source={{ uri: 'https://via.placeholder.com/45' }} // Replace with actual user profile image.
                style={styles.userImage}
              />
              <Text style={styles.username}>John Blender</Text>
            </View>

            <Text style={styles.detailTitle}>{discussion.title}</Text>
            <Text style={styles.detailBody}>{discussion.body}</Text>

            {/* Like and Share Buttons */}
            <View style={styles.detailActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  // Handle Like
                }}
              >
                <Ionicons name="heart-outline" size={20} color="#50C2C9" />
                <Text style={styles.actionText}>Like</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  // Handle Share
                }}
              >
                <Ionicons name="share-social-outline" size={20} color="#50C2C9" />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.commentsHeader}>Comments</Text>
          </View>
        }
      />

      {/* Add Comment Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.commentInputContainer}
      >
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleAddComment}>
          <Ionicons name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EFF3F8' },
  errorText: { color: '#D32F2F', textAlign: 'center', marginVertical: 10, fontSize: 16 },
  flatListContent: { paddingBottom: 100 },
  discussionDetail: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    margin: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  userImage: { width: 45, height: 45, borderRadius: 22.5, marginRight: 12 },
  username: { fontSize: 16, fontWeight: '600', color: '#333' },
  detailTitle: { fontSize: 24, fontWeight: '700', color: '#1D3557', marginBottom: 8 },
  detailBody: { fontSize: 16, color: '#555', lineHeight: 24 },
  detailActions: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'space-around',
  },
  actionButton: { flexDirection: 'row', alignItems: 'center' },
  actionText: { marginLeft: 6, fontSize: 15, fontWeight: '500', color: '#333' },
  commentsHeader: { fontSize: 20, fontWeight: '700', color: '#1D3557', marginVertical: 15 },
  commentItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  commentText: { fontSize: 16, color: '#555' },
  commentDate: { fontSize: 12, color: '#888', marginTop: 4 },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: { backgroundColor: '#50C2C9', padding: 10, borderRadius: 20 },
});

export default DiscussionDetail;






  
    

      