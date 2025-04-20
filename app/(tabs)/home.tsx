// HomePageWithComments.tsx
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import {
  collection,
  query,
  orderBy,
  where,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  increment,
  getDocs,
  getDoc,
  serverTimestamp,
  doc,
} from '@firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '@/firebaseConfig';
import { Link } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Share } from 'react-native';


// -------------------- Types --------------------
type Discussion = {
  id: string;
  title: string;
  body: string;
  user_id: string;
  user_name?: string;
  created_at: any;
  updated_at: any;
  likes_count: number;
};

type Comment = {
  id: string;
  comment_id: string;
  content: string;
  user_id: string;
  user_name?: string;
  discussion_id: string;
  created_at: any;
};

// -------------------- Comment Section --------------------
const CommentSection = ({ discussionId }: { discussionId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const commentsQuery = query(
      collection(db, "Comment"),
      where("discussion_id", "==", discussionId),
      orderBy("created_at", "asc")
    );

    const unsubscribe = onSnapshot(commentsQuery, async (snapshot) => {
      const fetched: Comment[] = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const commentData = docSnap.data() as Comment;
          const userSnap = await getDoc(doc(db, 'users', commentData.user_id));
          const user_name = userSnap.exists() ? userSnap.data().name : 'Anonymous';
          return {
            id: docSnap.id,
            ...commentData,
            user_name,
          };
        })
      );
      setComments(fetched);
    });

    return () => unsubscribe();
  }, [discussionId]);

  const addComment = async () => {
    const currentUser = getAuth().currentUser;
    if (!newComment.trim() || !currentUser) return;

    try {
      const docRef = await addDoc(collection(db, "Comment"), {
        content: newComment,
        user_id: currentUser.uid,
        discussion_id: discussionId,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });

      await updateDoc(doc(db, "Comment", docRef.id), {
        comment_id: docRef.id,
      });

      setNewComment('');
    } catch (error) {
      console.error("Error adding comment:", error);
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
          <View>
            <Text style={styles.commentUserName}>{comment.user_name}</Text>
            <Text style={styles.commentText}>{comment.content}</Text>
          </View>
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

// -------------------- Discussion Item --------------------
const DiscussionItem = ({ item }: { item: Discussion }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(item.likes_count || 0);

  useEffect(() => {
    const checkIfLiked = async () => {
      const currentUser = getAuth().currentUser;
      if (!currentUser) return;

      const likeQuery = query(
        collection(db, "likes"),
        where("user_id", "==", currentUser.uid),
        where("discussion_id", "==", item.id)
      );
      const snapshot = await getDocs(likeQuery);
      setIsLiked(!snapshot.empty);
    };

    checkIfLiked();
  }, [item.id]);

  const handleLike = async () => {
    const currentUser = getAuth().currentUser;
    if (!currentUser) return;

    const likeQuery = query(
      collection(db, "likes"),
      where("user_id", "==", currentUser.uid),
      where("discussion_id", "==", item.id)
    );
    const snapshot = await getDocs(likeQuery);

    if (snapshot.empty) {
      await addDoc(collection(db, "likes"), {
        user_id: currentUser.uid,
        discussion_id: item.id,
        liked: true,
        created_at: serverTimestamp(),
      });

      await updateDoc(doc(db, "discussions", item.id), {
        likes_count: increment(1),
      });

      setIsLiked(true);
      setLikesCount(likesCount + 1);
    } else {
      await deleteDoc(doc(db, "likes", snapshot.docs[0].id));
      await updateDoc(doc(db, "discussions", item.id), {
        likes_count: increment(-1),
      });

      setIsLiked(false);
      setLikesCount(likesCount - 1);
    }
    
    
  };

  const handleShare = async (item: Discussion) => {
    try {
      const result = await Share.share({
        message: `${item.title}\n\n${item.body}\n\nCheck it out on Feathr!`,
      });
  
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared via', result.activityType);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <View style={styles.discussionItem}>
      <Text style={styles.username}>{item.user_name || item.user_id}</Text>

      <Link
        href={{
          pathname: '/[id]',
          params: {
            id: item.id,
            title: item.title,
            body: item.body,
            likes_count: item.likes_count,
          },
        }}
      >
        <Text style={styles.title}>{item.title}</Text>
      </Link>

      <Text style={styles.body}>{item.body}</Text>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Ionicons name={isLiked ? "heart" : "heart-outline"} size={20} color={isLiked ? "#FF0000" : "#50C2C9"} />
          <Text style={styles.actionText}>{likesCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={20} color="#50C2C9" />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>

        <TouchableOpacity
  style={styles.actionButton}
  onPress={() => handleShare(item)}
>
  <Ionicons name="share-social-outline" size={20} color="#50C2C9" />
  <Text style={styles.actionText}>Share</Text>
</TouchableOpacity>

      </View>

      <CommentSection discussionId={item.id} />
    </View>
  );
};

// -------------------- HomePage --------------------
const HomePage = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'discussions'), orderBy('created_at', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Discussion[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Discussion, 'id'>),
      }));
      setDiscussions(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Explore Discussions</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#50C2C9" />
      ) : (
        <FlatList
          data={discussions}
          renderItem={({ item }) => <DiscussionItem item={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginVertical: 20,
    textAlign: 'center',
  },
  discussionItem: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  username: {
    fontWeight: '600',
    color: '#1D3557',
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0077b6',
    marginBottom: 6,
  },
  body: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
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
    fontSize: 14,
    color: '#50C2C9',
  },
  flatListContent: {
    paddingBottom: 100,
  },
  commentSection: {
    marginTop: 12,
    backgroundColor: '#e8f0f2',
    padding: 10,
    borderRadius: 8,
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  commentUserImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  commentUserName: {
    fontWeight: '600',
    fontSize: 13,
    color: '#222',
  },
  commentText: {
    fontSize: 13,
    color: '#333',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  commentButton: {
    padding: 6,
  },
});

export default HomePage;






