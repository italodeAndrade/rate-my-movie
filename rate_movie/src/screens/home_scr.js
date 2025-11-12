import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function InitialScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela Inicial de Teste</Text>
      
      {/* Container para alinhar os botões lado a lado */}
      <View style={styles.buttonGroup}> 
        
        {/* Botão 1: LOGIN */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
        
        {/* Botão 2: PERFIL (Para Teste) */}
        <TouchableOpacity
          style={[styles.button, styles.profileButton]} // Aplica um estilo diferente para diferenciar
          onPress={() => navigation.navigate('Profile')} // Navega para a rota Profile
        >
          <Text style={styles.buttonText}>PERFIL (TESTE)</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    marginBottom: 40,
    fontWeight: '600',
  },
  buttonGroup: { // Estilo para agrupar os botões horizontalmente
    flexDirection: 'row',
    gap: 15, // Espaçamento entre os botões
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  profileButton: {
    backgroundColor: '#34C759', // Cor diferente para o botão de teste
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});