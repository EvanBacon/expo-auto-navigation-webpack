import 'react-native-gesture-handler'

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './screens/_root';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs()
// LogBox.ignoreLogs([/Unhandled promise rejection/])
// import Navigation from './navigation';

// import { createStackNavigator } from '@react-navigation/stack';

// const stack = createStackNavigator();
export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
