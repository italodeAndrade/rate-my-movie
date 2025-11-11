// App.js
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator, View } from 'react-native';
import AppNavigator from './src/navigation/app_nav'; 
import { initDB } from './src/services/database'; 

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    async function setupDB() {
      try {
        await initDB(); 
        setDbInitialized(true);
      } catch (err) {
        console.error("Falha ao configurar o DB:", err);
      }
    }
    setupDB();
  }, []);


  if (!dbInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }
  
  return (

    <GestureHandlerRootView style={{ flex: 1 }}> 
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}