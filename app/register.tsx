import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { auth, db } from '../firebaseConfig'; // <-- Make sure this imports BOTH Auth & Firestore
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // <-- Firestore imports
import { InputCompo } from '@/components/InputCompo';
import { ButtonCompo } from '@/components/ButtonCompo';

// The RegisterPage component
const RegisterPage = () => {
  const router = useRouter();

  // Capture all necessary fields
  const [name, setName] = useState('');      // <-- new
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inputErrors, setInputErrors] = useState({ email: false, password: false });

  const handleSignUp = () => {
    setInputErrors({ email: false, password: false });

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed up in Firebase Auth
        const user = userCredential.user;
        console.log('User created in Auth:', user.email, user.uid);

        // Now store user info in Firestore "users" collection
        await setDoc(doc(db, 'users', user.uid), {
          user_id: user.uid,
          user_email: user.email,
          name: name,           // store the name captured from input
          created_at: new Date(),
        });

        Alert.alert('Success', 'Registration successful!');
        // Optionally navigate to another screen, e.g.:
        router.push('./signIn');
      })
      .catch((error) => {
        let errorMessage = '';
        const newInputErrors = { email: false, password: false };

        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'Invalid email.';
            newInputErrors.email = true;
            break;
          case 'auth/missing-password':
            errorMessage = 'Password is required.';
            newInputErrors.password = true;
            break;
          case 'auth/weak-password':
            errorMessage = 'Password should be at least 6 characters.';
            newInputErrors.password = true;
            break;
          case 'auth/email-already-in-use':
            errorMessage = 'This email is already registered. Try signing in instead.';
            newInputErrors.email = true;
            break;
          default:
            errorMessage = 'An unexpected error occurred. Please try again later.';
        }

        setInputErrors(newInputErrors);
        Alert.alert('Registration Error', errorMessage, [{ text: 'OK' }]);
      });
  };

  return (
    <View>
      <Image
        source={require('@/assets/project_images/shape.png')}
        style={{ position: 'absolute' }}
      />
      <SafeAreaView>
        <View style={styles.centralContainer}>
          <View>
            <Text style={styles.welcome}>Welcome to</Text>
            <Text style={styles.feather}>feather! 🪶</Text>
            <Text style={styles.journey}>Start your journey.</Text>
          </View>

          <View style={styles.inputContainer}>
            {/* Capture name from the user */}
            <InputCompo
              text="Enter your name"
              curValue={name}
              curChange={setName}
            />

            {/* Capture email */}
            <InputCompo
              text="Enter your email"
              curValue={email}
              curChange={setEmail}
            />

            {/* Capture password */}
            <InputCompo
              text="Enter password"
              curValue={password}
              curChange={setPassword}
              isSecure={true}
            />

            
            <InputCompo
              text="Confirm password"
            
            />

            <Text style={styles.agreement}>
              *By clicking register, you agree with the app's privacy policy...
            </Text>
          </View>

          <View style={styles.register}>
            <ButtonCompo onPress={handleSignUp} text="Register" />
          </View>

          <View style={styles.signinContainer}>
            <Text style={styles.haveAccount}>Already have an account?</Text>
            <TouchableOpacity
              onPress={() => router.push('./signIn')}
              activeOpacity={0.7}
            >
              <Text style={styles.signin}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  centralContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    gap: 21,
    alignItems: 'center',
  },
  journey: {
    color: 'rgba(0, 0, 0, 0.79)',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 13,
    marginTop: 10,
    marginBottom: 54,
  },
  welcome: {
    color: '#000',
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 22,
    marginTop: 179,
  },
  feather: {
    color: '#000',
    fontFamily: 'Praise',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '400',
    lineHeight: 28,
  },
  register: {
    marginTop: 30,
    marginBottom: 17,
  },
  haveAccount: {
    color: 'rgba(0, 0, 0, 0.79)',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 18,
  },
  signin: {
    color: 'rgba(80, 194, 201, 0.79)',
    fontFamily: 'Poppins',
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 18,
    marginLeft: 5,
  },
  signinContainer: {
    flexDirection: 'row',
  },
  agreement: {
    color: 'rgba(0, 0, 0, 0.79)',
    fontFamily: 'Poppins',
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 18,
    width: 346,
  },
});

export default RegisterPage;

