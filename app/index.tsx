
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/CustomButton';
import parachuteIcon from '@/assets/project_images/image1.png'; // Update with correct path
import worldMapIcon from '@/assets/project_images/image2.png';
import { useRouter } from "expo-router";

const App = () => {
  const router = useRouter();
    return (
        <SafeAreaView style={styles.container}>
            {/* Top Section: Parachute Icon */}
            <View style={styles.parachuteContainer}>
                <Image source={parachuteIcon} style={styles.parachuteIcon} />
            </View>

            {/* Middle Section: World Map Illustration */}
            <View style={styles.worldMapContainer}>
                <Image source={worldMapIcon} style={styles.worldMapIcon} />
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
            <View style={styles.buttonContainer}>
            <CustomButton  
            onPress={() => router.push("/home")}  title="Get Started"
                               
                               
            />
            
                                
                            
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4', // Matches light gray background in your design
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
    buttonContainer: {
        marginBottom: 30,
        width: '100%',
        paddingHorizontal: 40,
    },
});

export default App;
