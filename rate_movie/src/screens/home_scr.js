import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native'; // TouchableOpacity removido
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getLoggedInUserId } from '../services/auth_servc';
import { useMovies } from '../contexts/MoviesContext';

// 1. Importando nosso componente padrão
import AccessibleButton from '../components/AccessibleButton';

export default function InitialScreen() {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { loadWatchedMovies, clearMovies } = useMovies();

  useFocusEffect(
    React.useCallback(() => {
      checkLoginStatus();
    }, [])
  );

  const checkLoginStatus = async () => {
    const userId = await getLoggedInUserId();
    if (userId) {
      setIsLoggedIn(true);
      await loadWatchedMovies();
    } else {
      setIsLoggedIn(false);
      clearMovies();
    }
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        {/* 2. Ocultando emoji (decorativo) do leitor */}
        <Text style={styles.logo} importantForAccessibility="no">🎬</Text>
        <Text style={styles.title} accessibilityRole="header">Rate My Movie</Text>
        <Text style={styles.subtitle}>Seu catálogo pessoal de filmes</Text>

        {/* 3. Usando AccessibleButton */}
        <AccessibleButton
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
          label="Fazer login" // Trocado de accessibilityLabel para label
          accessibilityHint="Toque para ir para a tela de login"
        >
          <Text style={styles.buttonText}>ENTRAR</Text>
        </AccessibleButton>

        <AccessibleButton
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('Register')}
          label="Criar conta" // Trocado de accessibilityLabel para label
          accessibilityHint="Toque para criar uma nova conta"
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>CRIAR CONTA</Text>
        </AccessibleButton>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo} importantForAccessibility="no">🎬</Text>
      <Text style={styles.welcomeTitle} accessibilityRole="header">Bem-vindo!</Text>

      <View style={styles.menuContainer}>
        <AccessibleButton
          style={styles.menuButton}
          onPress={() => navigation.navigate('Search')}
          label="Buscar filmes"
          accessibilityHint="Toque para buscar e descobrir novos filmes"
        >
          {/* 4. Ocultando ícone duplicado */}
          <Text style={styles.menuIcon} importantForAccessibility="no">🔍</Text>
          <Text style={styles.menuText}>Buscar Filmes</Text>
        </AccessibleButton>

        <AccessibleButton
          style={styles.menuButton}
          onPress={() => navigation.navigate('MyMovies')}
          label="Meus filmes"
          accessibilityHint="Toque para ver sua lista de filmes assistidos"
        >
          <Text style={styles.menuIcon} importantForAccessibility="no">🎞️</Text>
          <Text style={styles.menuText}>Meus Filmes</Text>
        </AccessibleButton>

        <AccessibleButton
          style={styles.menuButton}
          onPress={() => navigation.navigate('Profile')}
          label="Meu perfil"
          accessibilityHint="Toque para ver e editar seu perfil"
        >
          <Text style={styles.menuIcon} importantForAccessibility="no">👤</Text>
          <Text style={styles.menuText}>Meu Perfil</Text>
        </AccessibleButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 50,
    textAlign: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    minHeight: 50, // Nosso AccessibleButton já garante 44, mas mantemos o estilo
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#007AFF',
  },
  menuContainer: {
    width: '100%',
    maxWidth: 400,
  },
  menuButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: 70, // Mantém o estilo visual
  },
  menuIcon: {
    fontSize: 36,
    marginRight: 20,
  },
  menuText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
});