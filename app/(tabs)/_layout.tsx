import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import Colors from "@/constants/Colors";
import React from "react";
import { useColorScheme } from "react-native";

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: "(tabs)",
};

const Page = () => {
    const theme = useColorScheme() ?? 'light';

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors[theme].primary, // Use theme-based primary color
                tabBarStyle: {
                    backgroundColor: '#f4f4f4',
                    borderTopWidth: 0,
                },
            }}
        >
            <Tabs.Screen
                name="homePage"
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name="flower-tulip"
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    tabBarLabel: "Explore",
                    tabBarIcon: ({ color }) => (
                        <Entypo name="open-book" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarLabel: "Profile",
                    tabBarIcon: ({ color }) => (
                        <Entypo name="user" size={24} color={color} />
                    ),
                }}
            />


           <Tabs.Screen
                name="notification"
                options={{
                    tabBarLabel: "Notification",
                    tabBarIcon: ({ color }) => (
                        <Entypo name="bell" size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
};

export default Page;
