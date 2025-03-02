import{ ButtonCompo }from '@/components/ButtonCompo';
import{ InputCompo }from '@/components/InputCompo';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebaseConfig';

const SigninPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [inputErrors, setInputErrors] = useState({ email: false, password: false });


  const handleSignIn = () => {
    setInputErrors({ email: false, password: false });

    auth
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user.email)
        router.push("./homePage")
        // ...
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
          case 'auth/invalid-credential':
            errorMessage = 'Your email or password is incorrect.';
            newInputErrors.password = true;
            break;
          default:
            errorMessage = 'An unexpected error occurred. Please try again later.';
        }

        setInputErrors(newInputErrors);
        Alert.alert('Registration Error', errorMessage, [{ text: 'OK' }]);
        // ..
      });
  }
  

  return (
    <View>
      <Image 
          source={require("@/assets/project_images/shape.png")}
          style={{position:'absolute'}}
      />
      <SafeAreaView>
        <View style={styles.centralContainer}>
          <View>
            <Text style={styles.welcome}>Welcome back!</Text>
            <Text style={styles.journey}>Resume your journey. </Text>
          </View>
          <View>
            <Image source={require('@/assets/project_images/image1.png')}  />
          <View>
          </View>
          </View>
          <View style={styles.inputContainer}>
            <InputCompo text='Enter your email' curValue={email} curChange={(text) => setEmail(text)}/>
            <InputCompo text='Enter password' curValue={password} curChange={(text) => setPassword(text)}/>
            <Text style={styles.agreement}>*Forget password</Text>
          </View>
          <View style={styles.register}>
            <ButtonCompo onPress={handleSignIn} text='Sign in'>
            </ButtonCompo>
          </View>
          <View style={styles.signinContainer}>
            <Text style={styles.haveAccount}>Don't have an account yet?</Text>
            <TouchableOpacity
              onPress={() => router.push("./register")}
              activeOpacity={0.7}>
            <Text style={styles.signup}>Sign up</Text>
          </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  centralContainer:{
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer:{
    gap: 21,
    alignItems: 'center',
  },
  journey:{
    color: 'rgba(0, 0, 0, 0.79)',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontSize: 13,
    // fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 13, 
    marginBottom: 8,
  },
  welcome:{
    color: '#000',              
    fontFamily: 'SemiBoldPoppins',
    fontSize: 18,
    // fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 22, 
    marginTop: 179,
  },
  feather:{
    color: '#000',
    fontFamily: 'Praise',
    textAlign: 'center', 
    fontSize: 24,
    // fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 28,
  },
  register:{
    marginTop: 30,
    marginBottom: 17,
  },
  haveAccount:{
    color: 'rgba(0, 0, 0, 0.79)',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 18,
  },
  signup:{
    color: 'rgba(80, 194, 201, 0.79)',
    fontFamily: 'SemiBoldPoppins',
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 18,
    marginLeft: 5,
  },
  signinContainer:{
    flexDirection:'row',
  },
  agreement: {
    color: 'rgba(0, 0, 0, 0.79)',
    fontFamily: 'Poppins',
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 18,
    width:346,
  }
});

export default SigninPage;
