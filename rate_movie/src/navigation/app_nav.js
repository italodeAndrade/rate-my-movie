
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import InitialScreen from '../screens/home_scr';
import LoginScreen from '../screens/login_scr';
import RegisterScreen from '../screens/register_scr';
import ProfileScreen from '../screens/profile_scr';
import SearchScreen from '../screens/search_scr';
import MovieDetailsScreen from '../screens/movie_details_scr';
import MyMoviesScreen from '../screens/my_movies_scr';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
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

      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Meu Perfil' }}
      />

      <Stack.Screen 
        name="Search" 
        component={SearchScreen}
        options={{ title: 'Buscar Filmes' }}
      />

      <Stack.Screen 
        name="MovieDetails" 
        component={MovieDetailsScreen}
        options={{ title: 'Detalhes do Filme' }}
      />

      <Stack.Screen 
        name="MyMovies" 
        component={MyMoviesScreen}
        options={{ title: 'Meus Filmes' }}
      />
    </Stack.Navigator>
  );
}