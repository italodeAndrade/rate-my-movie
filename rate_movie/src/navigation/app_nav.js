
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import InitialScreen from '../screens/home_scr';
import LoginScreen from '../screens/login_scr';
import RegisterScreen from '../screens/register_scr';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Home"
    >
      <Stack.Screen 
        name="Home" 
        component={InitialScreen}
        options={{
          headerShown: false,
        }} 
      />

      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ title: 'Entrar' }} 
      />

  
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ title: 'Criar Conta' }}
      />
    </Stack.Navigator>
  );
}