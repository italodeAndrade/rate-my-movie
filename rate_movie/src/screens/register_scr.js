import React, { useState } from 'react';
import { View, Text, Button, TextInput, Alert } from 'react-native';
import { register } from '../services/auth_servc'; 

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    
    try {
      const user = await register(email, password);
      Alert.alert('Conta Criada!', `Bem-vindo(a), ${user.email}.`);

    } catch (error) {
      Alert.alert('Erro no Cadastro', error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Tela de Registro</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ width: 200, height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 5 }} />
      <TextInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry style={{ width: 200, height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 5 }} />
      <Button title="Registrar" onPress={handleRegister} />
      <Button title="Voltar ao Login" onPress={() => navigation.goBack()} />
    </View>
  );
}
