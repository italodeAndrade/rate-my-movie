import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signIn } from '../services/auth_servc';

// Importando nossos novos componentes acessíveis
import AccessibleInput from '../components/AccessibleInput';
import AccessibleButton from '../components/AccessibleButton';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // REF para gerenciar o foco (RF07)
  const passwordRef = useRef(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const user = await signIn(email, password);
      if (user) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        alert('Usuário ou senha incorretos');
      }
    } catch (error) {
      alert("Ocorreu um erro durante o login.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo} accessibilityRole="header">🎬</Text>
      <Text style={styles.title}>Bem-vindo de Volta!</Text>

      <View style={styles.formContainer}>
        {/* Input de E-mail Refatorado */}
        <AccessibleInput
          label="E-mail"
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          // Gerenciamento de Foco:
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />

        {/* Input de Senha Refatorado */}
        <AccessibleInput
          ref={passwordRef} // Recebe o foco do anterior
          label="Senha"
          placeholder="Digite sua senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          // Ao dar enter aqui, tenta fazer login
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />

        {/* Botão de Login Refatorado */}
        <AccessibleButton
          label="Entrar no aplicativo"
          onPress={handleLogin}
          style={styles.loginButton}
        >
          <Text style={styles.loginButtonText}>ENTRAR</Text>
        </AccessibleButton>

        <View style={styles.divider} importantForAccessibility="no-hide-descendants">
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Botão de Cadastro Refatorado */}
        <AccessibleButton
          label="Criar uma nova conta"
          onPress={() => navigation.navigate('Register')}
          style={styles.registerButton}
        >
          <Text style={styles.registerButtonText}>CRIAR NOVA CONTA</Text>
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
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  // OBS: O estilo 'input' foi removido daqui pois agora vive dentro do AccessibleInput
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    marginTop: 10,
    minHeight: 50, // Mantendo visual original, mas AccessibleButton garante min 44
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
    fontSize: 14,
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#007AFF',
    minHeight: 50,
  },
  registerButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});