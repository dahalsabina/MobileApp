import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";

/**
 * The main application component that renders a welcome screen with images,
 * text, and a "Get Started" button.
 *
 * - Contains three primary sections: a top image (parachute icon), a middle
 *   image (world map illustration), and a text section with a welcome message.
 * - Provides a "Get Started" button that navigates the user to the home page.
 *
 * @component
 * @example
 * return <App />;
 */
const App = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Section: Parachute Icon */}
      <View style={styles.parachuteContainer}>
        <Image source={require('@/assets/project_images/image1.png')} style={styles.parachuteIcon} />
      </View>

      {/* Middle Section: World Map Illustration */}
      <View style={styles.worldMapContainer}>
        <Image source={require('@/assets/project_images/image2.png')} style={styles.worldMapIcon} />
      </View>

      {/* Text Section */}
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>
          Curious about {"\n"}what’s happening around the world?
        </Text>
        <Text style={styles.subtitleText}>
          Lorem ipsum dolor sit amet consectetur. {"\n"}
          Adipiscing in tristique mattis sed sed. {"\n"}
          Lorem ipsum dolor sit amet consectetur. {"\n"}
          Adipiscing in tristique mattis sed sed.
        </Text>
      </View>

      {/* Get Started Button */}
      <TouchableOpacity
        onPress={() => router.push("/homePage")}
        style={styles.button}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4', 
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  parachuteContainer: {
    marginTop: 50,
  },
  parachuteIcon: {
    width: 120,
    height: 120,
  },
  worldMapContainer: {
    marginVertical: 20,
  },
  worldMapIcon: {
    width: 150,
    height: 150,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  subtitleText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#38b2ac', 
    paddingVertical: 16,        
    paddingHorizontal: 32,      
    borderRadius: 12,           
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',           
    fontWeight: 'bold',         
    fontSize: 18,               
  },
});

export default App;
