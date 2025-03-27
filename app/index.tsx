import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";
import{ ButtonCompo }from '@/components/ButtonCompo';


/**
 * App component serves as the landing page of the application.
 * 
 * **Features:**
 * - Displays an introductory page with an engaging layout, including images, text, and a "Get Started" button.
 * - Integrates navigation to the main application page (`/homePage`) using `expo-router`.
 * - Adapts to different screen sizes with React Native's responsive styling.
 *
 * **Sections:**
 * - **Top Section**: A parachute icon.
 * - **Middle Section**: A world map illustration.
 * - **Text Section**: A title and subtitle that introduce the app.
 * - **Bottom Section**: A "Get Started" button to navigate to the main content.
 *
 *
 * @returns {JSX.Element} The rendered landing page.
 */
const App = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Section: Parachute Icon */}
      <View style={styles.parachuteContainer}>
        <Image
          testID="parachute-icon"
          source={require('@/assets/project_images/image1.png')}
          style={styles.parachuteIcon}
        />
      </View>

      {/* Middle Section: World Map Illustration */}
      <View style={styles.worldMapContainer}>
        
        <Image
          testID="world-map-icon"
          source={require('@/assets/project_images/image2.png')}
          style={styles.worldMapIcon}
        />
      </View>

      {/* Text Section */}
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>
          Explore the World {"\n"}Like Never Before
        </Text>
        <Text style={styles.subtitleText}>
          Discover stories, insights, and events {"\n"}
          happening across the globe. Let curiosity {"\n"}
          guide you to a world of endless possibilities.
        </Text>
      </View>

      {/* Get Started Button */}
      <ButtonCompo onPress={() => router.push("./signIn")} text='Register'></ButtonCompo>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2f3',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20,
  },
  parachuteContainer: {
    marginTop: 40,
  },
  parachuteIcon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  worldMapContainer: {
    marginVertical: 30,
  },
  worldMapIcon: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 25,
    marginVertical: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 10,
  },
  subtitleText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#7f8c8d',
  },
  button: {
    backgroundColor: '#38b2ac', 
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
    textTransform: 'uppercase',
  },
});

export default App;



