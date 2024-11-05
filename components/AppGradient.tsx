import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, StyleSheet } from "react-native";
import Content from "./Content";

const AppGradient = ({
    children,
    colors,
}: {
    children: any;
    colors: string[];
}) => {
    return (
        <LinearGradient colors={colors} style={styles.gradient}>
            <Content>{children}</Content>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
});

export default AppGradient;
