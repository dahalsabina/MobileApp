
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout(){
    return (
        <Stack>
            <Stack.Screen  name="(tabs)" options={{ headerShown: false }}/>
            <Stack.Screen  name="index" options={{ headerShown: false }}/>
            <Stack.Screen  name="register" options={{ headerShown: false }}/>
            <Stack.Screen  name="signIn" options={{ headerShown: false }}/>
        </Stack>
    )
}

