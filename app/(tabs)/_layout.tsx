import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import Colors from "@/constants/Colors";
import React from "react";
import { useColorScheme } from "react-native";

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
                tabBarStyle: {
                    backgroundColor: "#f4f4f4",
                    borderTopWidth: 0,
                },
            }}
        >
            {/* Home Tab */}
            <Tabs.Screen
                name="homePage"
                options={{
                    tabBarLabel: "Home",
                    /**
                     * Render the Home icon for the tab bar.
                     * @param {Object} param - Props passed to the icon.
                     * @param {string} param.color - The color for the icon.
                     * @returns {JSX.Element} Home icon component.
                     */
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="home" size={24} color="#777" />
                    ),
                }}
            />

            {/* Explore Tab */}
            <Tabs.Screen
                name="explore"
                options={{
                    tabBarLabel: "Explore",
                    /**
                     * Render the Explore icon for the tab bar.
                     * @param {Object} param - Props passed to the icon.
                     * @param {string} param.color - The color for the icon.
                     * @returns {JSX.Element} Explore icon component.
                     */
                    tabBarIcon: ({ color }) => (
                        <Entypo name="open-book" size={24} color={color} />
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
                    tabBarIcon: ({ color }) => (
                        <AntDesign name="pluscircle" size={24} color={color} />
                    ),
                }}
            />

            {/* Profile Tab */}
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarLabel: "Profile",
                    /**
                     * Render the Profile icon for the tab bar.
                     * @param {Object} param - Props passed to the icon.
                     * @param {string} param.color - The color for the icon.
                     * @returns {JSX.Element} Profile icon component.
                     */
                    tabBarIcon: ({ color }) => (
                        <Entypo name="user" size={24} color={color} />
                    ),
                }}
            />

            {/* Notification Tab */}
            <Tabs.Screen
                name="notification"
                options={{
                    tabBarLabel: "Notification",
                    /**
                     * Render the Notification icon for the tab bar.
                     * @param {Object} param - Props passed to the icon.
                     * @param {string} param.color - The color for the icon.
                     * @returns {JSX.Element} Notification icon component.
                     */
                    tabBarIcon: ({ color }) => (
                        <Entypo name="bell" size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

