import { ButtonCompo } from '@/components/ButtonCompo';
import { InputCompo } from '@/components/InputCompo';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebaseConfig';

const SigninPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inputErrors, setInputErrors] = useState({
    email: false,
    password: false,
  });

  const handleSignIn = () => {
    // Reset any previous errors
    setInputErrors({ email: false, password: false });

    // Sign in with Firebase Auth
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Signed in as:', user.email);

        // Navigate to profile page, passing the user’s email as a param
        router.push({
          pathname: './profilePage',
          params: { email: user.email },
        });
      })
      .catch((error) => {
        let errorMessage = '';
        const newInputErrors = { email: false, password: false };

        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'Invalid email format.';
            newInputErrors.email = true;
            break;

          case 'auth/missing-password':
            errorMessage = 'Password is required.';
            newInputErrors.password = true;
            break;

          case 'auth/user-not-found':
          case 'auth/wrong-password':
            // Combine both into a single error message
            errorMessage = 'Your email or password is incorrect.';
            newInputErrors.password = true;
            break;

          case 'auth/too-many-requests':
            errorMessage =
              'Too many failed attempts. Please try again later or reset your password.';
            newInputErrors.password = true;
            break;

          default:
            errorMessage =
              'An unexpected error occurred. Please try again later.';
        }

        setInputErrors(newInputErrors);
        Alert.alert('Sign In Error', errorMessage, [{ text: 'OK' }]);
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
            <Text style={styles.welcome}>Welcome back!</Text>
            <Text style={styles.journey}>Resume your journey.</Text>
          </View>

          {/* Example image */}
          <View>
            <Image source={require('@/assets/project_images/image1.png')} />
          </View>

          <View style={styles.inputContainer}>
            {/* Email */}
            <InputCompo
              text="Enter your email"
              curValue={email}
              curChange={(text) => setEmail(text)}
            />

            {/* Password */}
            <InputCompo
              text="Enter password"
              curValue={password}
              curChange={(text) => setPassword(text)}
              isSecure={true} // If your InputCompo supports secure text
            />

            <Text style={styles.agreement}>*Forget password</Text>
          </View>

          <View style={styles.register}>
            <ButtonCompo onPress={handleSignIn} text="Sign in" />
          </View>

          <View style={styles.signinContainer}>
            <Text style={styles.haveAccount}>Don't have an account yet?</Text>
            <TouchableOpacity onPress={() => router.push('./register')}>
              <Text style={styles.signup}>Sign up</Text>
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
    marginBottom: 8,
  },
  welcome: {
    color: '#000',
    fontFamily: 'SemiBoldPoppins',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 22,
    marginTop: 179,
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
    fontWeight: '400',
    lineHeight: 18,
  },
  signup: {
    color: 'rgba(80, 194, 201, 0.79)',
    fontFamily: 'SemiBoldPoppins',
    fontSize: 13,
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
    fontWeight: '400',
    lineHeight: 18,
    width: 346,
  },
});

export default SigninPage;

