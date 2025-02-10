// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjLivMkDdJqyBoZ_OOfUE--f3olaOABVc",
  authDomain: "fir-auth-8015c.firebaseapp.com",
  projectId: "fir-auth-8015c",
  storageBucket: "fir-auth-8015c.firebasestorage.app",
  messagingSenderId: "593642711872",
  appId: "1:593642711872:web:10d129a1c7c082d2e6e8a5",
  measurementId: "G-7Q0LY8JX6G"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); 
}

// const analytics = getAnalytics(app);

// Question
// Initialize Firebase Authentication and get a reference to the service
let auth;
try {
  // Will throw if Auth has not been initialized yet
  auth = getAuth(app);
} catch (error) {
  // If getAuth fails, we must initialize Auth
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });
// const auth = getAuth(app)

export { app, auth };