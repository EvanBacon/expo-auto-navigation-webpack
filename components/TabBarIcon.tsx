import * as React from 'react';
import Ionicons from "@expo/vector-icons/Ionicons";

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
export function TabBarIcon(props: { name: string, color: string }) {
    return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}
