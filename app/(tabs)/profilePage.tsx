import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '@/firebaseConfig';
import { Link } from 'expo-router';

type Discussion = {
  id: string;
  title: string;
  body: string;
  user_id: string;
  likes_count?: number;
  created_at: any;
};

type ProfileUser = {
  uid: string;
  name: string;
  email: string;
  age?: number;
  location?: string;
  bio?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [posts, setPosts] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', age: '', location: '', bio: '' });

  const auth = getAuth();

  useEffect(() => {
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
        setPosts(snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Discussion, 'id'>) })));
      });

      return () => {
        unsubUser();
        unsubPosts();
      };
    });

    return () => unsubscribe();
  }, []);

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

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#50C2C9" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {user && (
        <View style={styles.profileHeader}>
          {editing ? (
            <>
              <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={t => setForm(f => ({ ...f, name: t }))}
                placeholder="Name"
              />
              <TextInput
                style={styles.input}
                value={form.age}
                onChangeText={t => setForm(f => ({ ...f, age: t }))}
                placeholder="Age"
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                value={form.location}
                onChangeText={t => setForm(f => ({ ...f, location: t }))}
                placeholder="Location"
              />
              <TextInput
                style={[styles.input, { height: 80 }]}
                value={form.bio}
                onChangeText={t => setForm(f => ({ ...f, bio: t }))}
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

      <Text style={styles.sectionTitle}>Your Posts ({posts.length})</Text>
      <FlatList
        data={posts}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.postItem}>
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
              <Text style={styles.postTitle}>{item.title}</Text>
            </Link>
            <Text style={styles.postBody}>{item.body}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noPostsText}>No posts yet.</Text>}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 15,
    marginVertical: 10,
    color: '#0077b6',
  },
  postItem: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  postTitle: { fontSize: 18, fontWeight: '600', color: '#0077b6' },
  postBody: { marginTop: 6, fontSize: 14, color: '#333' },
  noPostsText: { textAlign: 'center', color: '#777', marginTop: 20 },
});








