import React, {useState} from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signIn } from '../services/auth_servc';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      <Text style={styles.logo}>🎬</Text>
      <Text style={styles.title}>Bem-vindo de Volta!</Text>
      
      <View style={styles.formContainer}>
        <TextInput 
          placeholder="E-mail" 
          value={email} 
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          accessibilityLabel="Campo de e-mail"
          accessibilityHint="Digite seu e-mail para fazer login"
        />
        
        <TextInput 
          placeholder="Senha" 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry
          style={styles.input}
          accessibilityLabel="Campo de senha"
          accessibilityHint="Digite sua senha"
        />

        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleLogin}
          accessibilityLabel="Botão entrar"
          accessibilityHint="Toque para fazer login"
          accessibilityRole="button"
        >
          <Text style={styles.loginButtonText}>ENTRAR</Text>
        </TouchableOpacity>
        
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity 
          style={styles.registerButton}
          onPress={() => navigation.navigate('Register')}
          accessibilityLabel="Botão criar conta"
          accessibilityHint="Toque para criar uma nova conta"
          accessibilityRole="button"
        >
          <Text style={styles.registerButtonText}>CRIAR NOVA CONTA</Text>
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
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    minHeight: 50,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    minHeight: 50,
    justifyContent: 'center',
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
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
    minHeight: 50,
    justifyContent: 'center',
  },
  registerButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});