import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import Colors from "@/constants/Colors";
import React from "react";
import { useColorScheme, Image, StyleSheet, Dimensions } from "react-native"; // Import Dimensions

const postIcon = require('../../assets/project_images/post.png');
const profileIcon = require('../../assets/project_images/profile.png')
const exploreIcon = require('../../assets/project_images/explore.png')
const homeIcon = require('../../assets/project_images/home.png')

const screenWidth = Dimensions.get("window").width; // Get screen width

/**
 * Page component renders a tab-based navigation layout for the app.
 * It uses the Expo Router `Tabs` component and dynamically applies a theme.
 *
 * The tabs include:
 * - Home
 * - Explore
 * - Discussion Post
 * - Profile
 * - Notification
 *
 * The theme adapts based on the user's color scheme (light/dark mode).
 *
 * 
 * @returns {JSX.Element} The rendered tab navigation layout.
 */
export default function Page() {
    // Determine the color scheme (light or dark), defaulting to "light".
    const theme = useColorScheme() ?? "light";

    return (
        <Tabs
            screenOptions={{
                // Hide the header in all tabs
                headerShown: false,
                // Set active tab color based on theme's primary color
                tabBarActiveTintColor: Colors[theme].primary,
                // Customize the tab bar's appearance
                tabBarStyle: styles.tabBarStyle,
            }}
        >
            {/* Home Tab */}
            <Tabs.Screen
                name="home"
                options={{
                    tabBarLabel: "",
                    /**
                     * Render the Home icon for the tab bar.
                     * @param {Object} param - Props passed to the icon.
                     * @param {string} param.color - The color for the icon.
                     * @returns {JSX.Element} Home icon component.
                     */
                    tabBarIcon: () => (
                        <Image source={homeIcon} style={styles.navImageIconHome} />)
                }}
            />

            {/* Explore Tab */}
            <Tabs.Screen
                name="explore"
                options={{
                    tabBarLabel: "",
                    /**
                     * Render the Explore icon for the tab bar.
                     * @param {Object} param - Props passed to the icon.
                     * @param {string} param.color - The color for the icon.
                     * @returns {JSX.Element} Explore icon component.
                     */
                    tabBarIcon: () => (
                        <Image source={exploreIcon} style={styles.navImageIconExplore} />
                    ),
                }}
            />

            {/* Discussion Post Tab */}
            <Tabs.Screen
                name="discussionPost"
                options={{
                    tabBarLabel: "",
                    /**
                     * Render the Add Post icon for the tab bar.
                     * @param {Object} param - Props passed to the icon.
                     * @param {string} param.color - The color for the icon.
                     * @returns {JSX.Element} Add Post icon component.
                     */
                    tabBarIcon: () => (
                        <Image source={postIcon} style={styles.navImageIconPost} />
                    ),
                }}
            />

            {/* Profile Tab */}
            <Tabs.Screen
                name="profilePage"
                options={{
                    tabBarLabel: "",
                    /**
                     * Render the Profile icon for the tab bar.
                     * @param {Object} param - Props passed to the icon.
                     * @param {string} param.color - The color for the icon.
                     * @returns {JSX.Element} Profile icon component.
                     */
                    tabBarIcon: () => (
                        <Image source={profileIcon} style={styles.navImageIconProfile} />
                    ),
                }}
            />

            {/* Notification Tab */}
            {/* <Tabs.Screen
                name="notification"
                options={{
                    tabBarLabel: "",
                    tabBarIcon: ({ color }) => (
                        <Entypo name="bell" size={24} color={color} />
                    ),
                }}
            /> */}
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBarStyle: {
        backgroundColor: "#50C2C9",
        height: 60,
        paddingHorizontal: 16, // Add 16px padding on both sides
        flexDirection: "row",
        justifyContent: "space-between", // Evenly space icons
        alignItems: "center", // Center icons vertically
        paddingTop: 20,
    },
    navImageIconHome: {
        width: 25,
        height: 19.4,
    },
    navImageIconPost: {
        width: 21.875,
        height: 21.875,
    },
    navImageIconExplore: {
        width: 16,
        height: 25,
    },
    navImageIconProfile: {
        width: 24.2,
        height: 24.2,
    },
});

