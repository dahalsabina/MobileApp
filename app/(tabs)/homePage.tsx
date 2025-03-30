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
} from 'react-native';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  where, 
  addDoc, 
  serverTimestamp, 
  doc, 
  updateDoc,
  getDocs,
  deleteDoc,
  increment
} from '@firebase/firestore';
import { db } from '../../firebaseConfig';
import { Link } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';

/**
 * Discussion type representing the structure of a discussion object.
 */
type Discussion = {
  id: string;
  title: string;
  body: string;
  user_id: string;
  created_at: any;
  updated_at: any;
  likes_count: number; // Add likes_count field
};

/**
 * Comment type representing the structure of a comment.
 */
type Comment = {
  id: string;
  comment_id: string; // Add comment_id field
  content: string;
  user_id: string;
  discussion_id: string;
  created_at: any;
};

/**
 * Comment Section Component
 */
const CommentSection = ({ discussionId }: { discussionId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    console.log("Fetching comments for discussionId:", discussionId);

    const commentsQuery = query(
      collection(db, "Comment"),
      where("discussion_id", "==", discussionId), // ✅ Filtering by discussion_id
      orderBy("created_at", "asc") // ✅ Ordering by created_at
    );
    

    const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
      const fetchedComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[];
      
      console.log("Fetched Comments:", fetchedComments);
      setComments(fetchedComments);
    });

    return () => unsubscribe();
  }, [discussionId]);

  const addComment = async () => {
    if (newComment.trim() === '') return;

    try {
      // Step 1: Add the document to Firestore without the comment_id
      const docRef = await addDoc(collection(db, "Comment"), {
        content: newComment,
        user_id: "currentUserId", // Replace with authenticated user's ID
        discussion_id: discussionId, // ✅ Store as a string instead of a Firestore reference
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });

      // Step 2: Update the document to include the comment_id
      await updateDoc(doc(db, "Comment", docRef.id), {
        comment_id: docRef.id, // Add the auto-generated ID as comment_id
      });

      console.log("Comment added with ID:", docRef.id); // Log the document ID
      setNewComment('');
    } catch (error) {
      console.error("Error adding comment:", error); // Log the full error
    }
  };

  return (
    <View style={styles.commentSection}>
      {comments.map((comment) => (
        <View key={comment.id} style={styles.commentItem}>
          <Image
            source={{ uri: 'https://via.placeholder.com/30' }}
            style={styles.commentUserImage}
          />
          <Text style={styles.commentText}>{comment.content}</Text>
        </View>
      ))}
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Write a comment..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity onPress={addComment} style={styles.commentButton}>
          <Ionicons name="send" size={20} color="#50C2C9" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

/**
 * Discussion Item Component
 */
const DiscussionItem = ({ item }: { item: Discussion }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(item.likes_count || 0);

  useEffect(() => {
    // Check if the current user has liked the discussion
    const checkIfLiked = async () => {
      const likeQuery = query(
        collection(db, "likes"),
        where("user_id", "==", "currentUserId"), // Replace with actual user ID
        where("discussion_id", "==", item.id)
      );

      const querySnapshot = await getDocs(likeQuery);
      setIsLiked(!querySnapshot.empty);
    };

    checkIfLiked();
  }, [item.id]);

  const onLikePress = async () => {
    await handleLike(item.id, "currentUserId"); // Replace with actual user ID
    setIsLiked(!isLiked); // Toggle the like state
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1); // Update likes count
  };

  const handleLike = async (discussionId: string, userId: string) => {
    try {
      // Check if the user has already liked the discussion
      const likeQuery = query(
        collection(db, "likes"),
        where("user_id", "==", userId),
        where("discussion_id", "==", discussionId)
      );

      const querySnapshot = await getDocs(likeQuery);

      if (querySnapshot.empty) {
        // If the user hasn't liked the discussion, add a like
        await addDoc(collection(db, "likes"), {
          user_id: userId,
          discussion_id: discussionId,
          liked: true, // Add liked field
          created_at: serverTimestamp(),
        });

        // Increment the likes_count in the discussions collection
        const discussionRef = doc(db, "discussions", discussionId);
        await updateDoc(discussionRef, {
          likes_count: increment(1), // Increment likes_count by 1
        });

        console.log("Discussion liked!");
      } else {
        // If the user has already liked the discussion, remove the like
        const likeId = querySnapshot.docs[0].id;
        await deleteDoc(doc(db, "likes", likeId));

        // Decrement the likes_count in the discussions collection
        const discussionRef = doc(db, "discussions", discussionId);
        await updateDoc(discussionRef, {
          likes_count: increment(-1), // Decrement likes_count by 1
        });

        console.log("Discussion unliked!");
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  return (
    <View style={styles.discussionItem}>
      <View style={styles.userRow}>
        <Text style={styles.username}>John Blender</Text>
      </View>

      {/* <Link
        href={{
          pathname: '/[id]',
          params: { id: item.id.toString() },
        }}
      >
        <Text style={styles.clickableTitle}>{item.title}</Text>
      </Link> */}

<Link
  href={{
    pathname: '/[id]',
    params: { 
      id: item.id.toString(),
      title: item.title,
      body: item.body,
      likes_count: item.likes_count,
    },
  }}
>
  <Text style={styles.clickableTitle}>{item.title}</Text>
</Link>


      <View style={styles.bodyContainer}>
        <Text style={styles.discussionBody}>{item.body}</Text>
      </View>

      {/* Like Button */}
      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={onLikePress}
      >
        <Ionicons 
          name={isLiked ? "heart" : "heart-outline"} 
          size={20} 
          color={isLiked ? "#FF0000" : "#50C2C9"} 
        />
        <Text style={styles.actionText}>{likesCount}</Text>
      </TouchableOpacity>

      {/* Comment and Share Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={20} color="#50C2C9" />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-social-outline" size={20} color="#50C2C9" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Comments Section */}
      <CommentSection discussionId={item.id} />
    </View>
  );
};

/**
 * HomePage Component
 */
const HomePage = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'discussions'), orderBy('created_at', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedDiscussions: Discussion[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          body: doc.data().body,
          user_id: doc.data().user_id,
          created_at: doc.data().created_at,
          updated_at: doc.data().updated_at,
          likes_count: doc.data().likes_count || 0, // Initialize likes_count
        }));

        setDiscussions(fetchedDiscussions);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching discussions:', error);
        setError('Failed to load discussions');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Discussions</Text>
      </View>

      {loading && <ActivityIndicator size="large" color="#1D3557" />}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <FlatList
        data={discussions}
        renderItem={({ item }) => <DiscussionItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContent}
      />
    </SafeAreaView>
  );
};

/**
 * Styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF3F8',
  },
  header: {
    backgroundColor: '#50C2C9', // Keeping the teal color
    paddingVertical: 35,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  discussionItem: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginVertical: 10,
    marginHorizontal: 20,
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
  clickableTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D3557',
    marginBottom: 8,
  },
  bodyContainer: {
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  discussionBody: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 6,
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
  },
  flatListContent: {
    paddingBottom: 100,
    paddingTop: 10,
  },
  commentSection: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  commentUserImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  commentText: {
    fontSize: 14,
    color: '#555',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    paddingTop: 8,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 35,
  },
  commentButton: {
    marginLeft: 8,
  },
});

export default HomePage;














