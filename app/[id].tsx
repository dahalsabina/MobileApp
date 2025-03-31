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
  getDocs,
  updateDoc,
  deleteDoc,
  increment,
  serverTimestamp,
} from '@firebase/firestore';
import { db } from '../firebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams as useSearchParams, router } from 'expo-router';

// Hides the default header (tabs, [id]) for this screen
export const screenOptions = {
  headerShown: false,
};

// -------------------- Types --------------------
type Discussion = {
  id: string;
  title: string;
  body: string;
  user_id: string;
  created_at: any;
  updated_at: any;
  likes_count: number;
};

type Comment = {
  id: string;
  content: string;
  user_id: string;
  created_at: any;
  discussion_id: string;
};

const DiscussionDetail = () => {
  const { id } = useSearchParams();
  const discussionId = id as string;

  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!discussionId) return;

    // Listen to discussion document updates
    const discussionRef = doc(db, 'discussions', discussionId);
    const unsubscribeDiscussion = onSnapshot(
      discussionRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as Omit<Discussion, 'id'>;
          setDiscussion({ id: docSnapshot.id, ...data });
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

    // Listen to comments for this discussion
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

  // Check if the user has liked this discussion
  useEffect(() => {
    const checkIfLiked = async () => {
      const likeQuery = query(
        collection(db, "likes"),
        where("user_id", "==", "currentUserId"), // Replace with actual user ID
        where("discussion_id", "==", discussionId)
      );
      const snapshot = await getDocs(likeQuery);
      setIsLiked(!snapshot.empty);
    };

    if (discussionId) {
      checkIfLiked();
    }
  }, [discussionId]);

  // Toggle like/unlike
  const handleLike = async () => {
    try {
      const likeQuery = query(
        collection(db, "likes"),
        where("user_id", "==", "currentUserId"), // Replace with actual user ID
        where("discussion_id", "==", discussionId)
      );
      const snapshot = await getDocs(likeQuery);

      if (snapshot.empty) {
        // Add like document
        await addDoc(collection(db, "likes"), {
          user_id: "currentUserId",
          discussion_id: discussionId,
          liked: true,
          created_at: serverTimestamp(),
        });
        // Increment like count
        await updateDoc(doc(db, "discussions", discussionId), {
          likes_count: increment(1),
        });
        setIsLiked(true);
      } else {
        // Remove the like document
        await deleteDoc(doc(db, "likes", snapshot.docs[0].id));
        // Decrement like count
        await updateDoc(doc(db, "discussions", discussionId), {
          likes_count: increment(-1),
        });
        setIsLiked(false);
      }
    } catch (err) {
      console.error("Error handling like:", err);
    }
  };

  // Add a new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await addDoc(collection(db, 'Comment'), {
        content: newComment,
        user_id: 'currentUserId', // Replace with actual user ID
        discussion_id: discussionId,
        created_at: serverTimestamp(),
      });
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  // Render individual comment
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#1D3557" />
      </SafeAreaView>
    );
  }

  if (error || !discussion) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error || 'Discussion not found'}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1D3557" />
        </TouchableOpacity>
        {/* <Text style={styles.headerTitle}>Discussion</Text> */}
      </View>

      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContent}
        ListHeaderComponent={
          <View style={styles.discussionDetail}>
            <View style={styles.userRow}>
              <Image
                source={{ uri: 'https://via.placeholder.com/45' }}
                style={styles.userImage}
              />
              <Text style={styles.username}>{discussion.user_id}</Text>
            </View>

            <Text style={styles.detailTitle}>{discussion.title}</Text>
            <Text style={styles.detailBody}>{discussion.body}</Text>

            <View style={styles.detailActions}>
              <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                <Ionicons
                  name={isLiked ? "heart" : "heart-outline"}
                  size={20}
                  color={isLiked ? "#FF0000" : "#50C2C9"}
                />
                <Text style={styles.actionText}>
                  Like {discussion.likes_count || 0}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="share-social-outline" size={20} color="#50C2C9" />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.commentsHeader}>Comments</Text>
          </View>
        }
      />

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
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
  },
  flatListContent: { paddingBottom: 100 },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: '#EFF3F8',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    color: '#1D3557',
  },
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
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D3557',
    marginBottom: 8,
  },
  detailBody: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  detailActions: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'space-around',
  },
  actionButton: { flexDirection: 'row', alignItems: 'center' },
  actionText: {
    marginLeft: 6,
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  commentsHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D3557',
    marginVertical: 15,
  },
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
  sendButton: {
    backgroundColor: '#50C2C9',
    padding: 10,
    borderRadius: 20,
  },
});

export default DiscussionDetail;









  
    

      