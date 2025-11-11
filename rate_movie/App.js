import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/app_nav'; 

import { GestureHandlerRootView } from 'react-native-gesture-handler'; 

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}> 
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}