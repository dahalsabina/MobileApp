import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

/**
 * RootLayout component serves as the primary layout for the application.
 * 
 * **Purpose:**
 * - Sets up a stack-based navigation system using `expo-router`.
 * - Defines the initial screens and navigation behavior for the app.
 * 
 * **Features:**
 * - Configures two screens: `(tabs)` and `index`, both with hidden headers.
 * - Integrates with the Expo Router for seamless navigation.
 * - Provides a clean and centralized layout for the application.
 *
 * **Navigation Setup:**
 * - `(tabs)`: Represents the main tab-based navigation component.
 * - `index`: Represents a specific screen in the stack hierarchy.
 *
 * **Customization:**
 * - Hides the headers for both screens using `headerShown: false`.
 *
 * 
 * @returns {JSX.Element} The stack navigation layout for the app.
 */
export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen  name="(tabs)" options={{ headerShown: false }}/>
            <Stack.Screen  name="index" options={{ headerShown: false }}/>
            <Stack.Screen  name="register" options={{ headerShown: false }}/>
            <Stack.Screen  name="signIn" options={{ headerShown: false }}/>
        </Stack>
    )
}


