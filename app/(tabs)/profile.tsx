import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import PostCardCompo from '../../components/PostCardCompo';
import { useLocalSearchParams } from 'expo-router';
import { collection, query, where, getDocs, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Link } from 'expo-router';



// Define types for the post data
interface Post {
  id: string;
  username: string;
  content: string;
  image: string;
  shares: number;
  comments: number;
  likes: number;
}

type ProfileUser = {
  uid: string;
  name: string;
  email: string;
  age?: number;
  location?: string;
  bio?: string;
};

const Profile = () => {
  const { email } = useLocalSearchParams();

  const [userId, setUserId] = useState<string | null>(null);
  const [discussions, setDiscussions] = useState<any[]>([]); 
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', age: '', location: '', bio: '' });

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        if (!email) return;

        // Reference the Firestore collection
        const usersRef = collection(db, 'users');

        // Query Firestore for the document with the matching email
        const q = query(usersRef, where('user_email', '==', email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Assuming there's only one document per email
          const userDoc = querySnapshot.docs[0];
          const fetchedUserId = userDoc.data().user_id;
          setUserId(fetchedUserId);
          // Log the user ID to the console
          // console.log('Fetched user ID:', fetchedUserId);

          // Fetch discussions for the user
          fetchDiscussions(fetchedUserId);
        } else {
          console.log('No user found with the provided email.');
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    const fetchDiscussions = async (userId: string) => {
      try {
        // Reference the Firestore collection
        const discussionsRef = collection(db, 'discussions');

        // Query Firestore for discussions with the matching user_id
        const q = query(discussionsRef, where('user_id', '==', userId));
        const querySnapshot = await getDocs(q);

        const userDiscussions = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDiscussions(userDiscussions);

        // Log the discussions to the console
        // console.log('Fetched discussions:', userDiscussions);
      } catch (error) {
        console.error('Error fetching discussions:', error);
      }
    };
    
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
          if (!fbUser) {
            setLoading(false);
            return;
          }
    
          const uid = fbUser.uid;
          const userRef = doc(db, 'users', uid);
    
          const unsubUser = onSnapshot(userRef, (snap) => {
            if (!snap.exists()) {
              setLoading(false);
              return;
            }
    
            const data = snap.data();
            const prof: ProfileUser = {
              uid,
              name: data.name,
              email: data.user_email || fbUser.email || '',
              age: data.age,
              location: data.location,
              bio: data.bio,
            };
    
            setUser(prof);
            setForm({
              name: prof.name,
              age: prof.age?.toString() || '',
              location: prof.location || '',
              bio: prof.bio || '',
            });
            setLoading(false);
          });
    
          const postsQuery = query(collection(db, 'discussions'), where('user_id', '==', uid));
          const unsubPosts = onSnapshot(postsQuery, (snap) => {
            setDiscussions(snap.docs.map((d) => {
              const { id: _, ...data } = d.data() as Post; // Exclude 'id' from spread
              return { id: d.id, ...data };
            }));
          });
    
          return () => {
            unsubUser();
            unsubPosts();
          };
        });
    fetchUserId();
    return () => unsubscribe();
  }, [email]);

  const saveProfile = async () => {
      if (!user) return;
  
      try {
        const userRef = doc(db, 'users', user.uid);
        const fields: Record<string, any> = {
          name: form.name,
          age: form.age ? Number(form.age) : null,
          location: form.location,
          bio: form.bio,
        };
        await updateDoc(userRef, fields);
        setEditing(false);
      } catch (err) {
        console.error('Failed to save profile:', err);
      }
    };
  // Transform discussions into posts
const posts: Post[] = discussions.map((discussion) => ({
  id: discussion.id,
  username: discussion.user_id, // default using user_id
  content: discussion.body,
  image: '', // default
  shares: 0, 
  comments: 0, 
  likes: discussion.likes_count,
  isLiked: discussion.isLiked || false,
}));

const handleLike = async (postId: string) => {
  try {
    // Find the current discussion
    const currentDiscussion = discussions.find((d) => d.id === postId);
    if (!currentDiscussion) return;

    const isLiked = currentDiscussion.isLiked || false; // Default to false if not set
    const updatedLikesCount = isLiked
      ? currentDiscussion.likes_count - 1
      : currentDiscussion.likes_count + 1;

    // Update the local state
    setDiscussions((prevDiscussions) =>
      prevDiscussions.map((discussion) =>
        discussion.id === postId
          ? { ...discussion, likes_count: updatedLikesCount, isLiked: !isLiked }
          : discussion
      )
    );

    // Update Firebase
    const postRef = doc(db, 'discussions', postId);
    await updateDoc(postRef, {
      likes_count: updatedLikesCount,
    });
  } catch (error) {
    console.error('Error toggling like:', error);
  }
};

const handleComment = async (postId: string) => {
  // Similar logic for comments
};

const handleShare = async (postId: string) => {
  // Similar logic for shares
};

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#50C2C9" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image 
        source={require("@/assets/project_images/shape.png")}
        style={styles.twoCirclesBackground}
      />
      <StatusBar barStyle="dark-content" backgroundColor="#000" />
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/project_images/profile_minions.jpg')} 
          style={styles.profileImage}
        />
        <Text style={styles.welcomeText}>Welcome {userId}</Text>
      </View>

      {user && (
              <View style={styles.profileHeader}>
                {editing ? (
                  <>
                    <TextInput
                      style={styles.input}
                      value={form.name}
                      onChangeText={(t) => setForm((f) => ({ ...f, name: t }))}
                      placeholder="Name"
                    />
                    <TextInput
                      style={styles.input}
                      value={form.age}
                      onChangeText={(t) => setForm((f) => ({ ...f, age: t }))}
                      placeholder="Age"
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={styles.input}
                      value={form.location}
                      onChangeText={(t) => setForm((f) => ({ ...f, location: t }))}
                      placeholder="Location"
                    />
                    <TextInput
                      style={[styles.input, { height: 80 }]}
                      value={form.bio}
                      onChangeText={(t) => setForm((f) => ({ ...f, bio: t }))}
                      placeholder="Bio"
                      multiline
                    />
                    <View style={styles.buttonRow}>
                      <TouchableOpacity style={styles.button} onPress={() => setEditing(false)}>
                        <Text style={styles.buttonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.button} onPress={saveProfile}>
                        <Text style={styles.buttonText}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.name}>{user.name}</Text>
                    {user.age != null && <Text style={styles.sub}>{user.age} yrs</Text>}
                    {user.location && <Text style={styles.sub}>{user.location}</Text>}
                    {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
                    <TouchableOpacity onPress={() => setEditing(true)} style={styles.editButton}>
                      <Text style={styles.editText}>Edit Profile</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}

      {/* Post List */}
      <ScrollView style={styles.scrollView}>
        {posts.map((post) => (
          <PostCardCompo
            username={post.username}
            content={post.content}
            imageSource={
              post.image.startsWith('http')
                ? { uri: post.image }
                : require('../../assets/project_images/profile_minions.jpg')
            }
            profileImageSource={post.image.startsWith('http')
              ? { uri: post.image }
              : require('../../assets/project_images/profile_minions.jpg')}
            likes={post.likes}
            comments={post.comments}
            shares={post.shares}
            onLike={() => handleLike(post.id)}
            onComment={() => handleComment(post.id)}
            onShare={() => handleShare(post.id)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#50C2C9',
  },
  twoCirclesBackground: {
    position: 'absolute',
    zIndex: 1, 
  },
  header: {
    backgroundColor: '#50C2C9',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
    // borderWidth: 1,
    // borderColor: '#50C2C9',
  },
  welcomeText: {
    fontSize: 17,
    // fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  name: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50' },
  sub: { fontSize: 16, color: '#333', marginTop: 4 },
  bio: { fontSize: 14, color: '#555', marginTop: 8, textAlign: 'center' },
  editButton: { marginTop: 10 },
  editText: { color: '#50C2C9', fontSize: 16 },
  input: {
    width: '100%',
    backgroundColor: '#eaeaea',
    padding: 10,
    borderRadius: 8,
    marginVertical: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    width: '100%',
  },
  button: {
    backgroundColor: '#50C2C9',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  scrollView: {
    flex: 1,
    backgroundColor: '#D9D9D9',
  },
});

export default Profile;