import{ ButtonCompo }from '@/components/ButtonCompo';
import{ InputCompo }from '@/components/InputCompo';
import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import Constants from 'expo-constants';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google"
import { panHandlerName } from 'react-native-gesture-handler/lib/typescript/handlers/PanGestureHandler';

// process.env.GOOGLE_CLIENT_ID;
const iosClientId = "359637781473-fgkpsomsiavl1mon0q2lkt3orf9ijstg.apps.googleusercontent.com"
const webClientId = "359637781473-6081rnkqg86p0mbmkvovlqpcjouc9jt6.apps.googleusercontent.com"
const androidClientId = ""

WebBrowser.maybeCompleteAuthSession()


const SigninPage = () => {
  const config = {
    webClientId,
    iosClientId,
    androidClientId,
  }

  // Google Authentication Hook
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: webClientId,
    iosClientId: iosClientId,
    androidClientId: androidClientId,
    redirectUri: AuthSession.makeRedirectUri({
      native: "com.boidtravel:/oauthredirect"
    })
  });

  // const redirectUri = AuthSession.makeRedirectUri({
  //   // Specify the useProxy option directly in the context of the method
  //   path: '', // Optional: Use if you need a specific path
  //   preferLocalhost: false, // Ensures the Expo proxy is used when available
  // });
  // console.log('Redirect URI:', redirectUri);

  const handleToken = () => {
    if(response?.type === "success") {
      const {authentication} = response;
      const token = authentication?.accessToken;
      console.log("access token", token)
    }
  }

  useEffect(() => {
    handleToken();
  }, [response])
  
  // const handleGoogleSignIn = async () => {
  //   try {
  //     const result = await promptAsync();
  //     if (result.type === 'success') {
  //       const { authentication } = result;
  
  //       // Mocking backend call
  //       Alert.alert('Signed in successfully! Token:', authentication?.accessToken);
  //       router.push('/homePage');
  //     } else if (result.type === 'dismiss') {
  //       Alert.alert('Sign-in dismissed');
  //     }
  //   } catch (error) {
  //     console.error('Google Sign-In Error:', error);
  //     Alert.alert('Google Sign-In Error', error.message || 'An unexpected error occurred.');
  //   }
  // };

// /////////////////////////////////////////////////////////////////////////////


  const handlePress = () => {
    // google authentication
    Alert.alert('google authentication');
  };
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Praise: require('../assets/fonts/Praise-Regular.ttf'),
    Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
    SemiBoldPoppins: require('../assets/fonts/Poppins-SemiBold.ttf')
  });
  

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
            <InputCompo text='Enter your email' />
            <InputCompo text='Enter password' />
            <Text style={styles.agreement}>*Forget password</Text>
          </View>
          <View style={styles.register}>
            <ButtonCompo onPress={handlePress} text='Sign in'>
            </ButtonCompo>
          </View>
          <View style={styles.signinContainer}>
            <Text style={styles.haveAccount}>Don't have an account yet?</Text>
            <TouchableOpacity
              onPress={() => promptAsync()}
              activeOpacity={0.7}>
            <Text style={styles.signup}>Sign up with Google</Text>
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
