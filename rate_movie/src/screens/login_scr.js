import React from 'react';
import { View, Text, StyleSheet, Button, TextInput} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signIn } from '../services/auth_servc';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const user = await signIn(email, password);
      if (user) {
        navigation.navigate('Main');
      } 
      else {
        alert('Usuário ou senha incorretos');
      }
    } 
    catch (error) {
      console.error("Erro no login:", error);
      alert("Ocorreu um erro durante o login.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Tela de Login</Text>
      <TextInput placeholder="email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />

      <Button title="logar" onPress={handleLogin} />
      
      <Button
        title="registrar"
        onPress={() => navigation.navigate('Register')}
      />


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
});