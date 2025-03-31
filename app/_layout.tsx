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
 * - Configures screens: `(tabs)`, `index`, `register`, and `signIn`, all with hidden headers.
 * - Integrates with Expo Router for seamless navigation.
 * - Provides a centralized layout for the application.
 *
 * @returns {JSX.Element} The stack navigation layout for the app.
 */
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Example: "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
  });

  useEffect(() => {
    if (!fontsLoaded) return;
    // Optionally hide your splash screen here if using one.
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // You can render <SplashScreen /> if preferred.
  }

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false, // Hides headers for all screens in this stack
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="signIn" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}



