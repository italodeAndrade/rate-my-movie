import React, { useState } from 'react';
import { View, Text, Button, TextInput, Alert, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { register } from '../services/auth_servc'; 
import { saveProfilePhoto } from '../services/img_servc';
import * as ImagePicker from 'expo-image-picker';

export default function RegisterScreen({ navigation }) {
    // 1. Estados
    const [photoUri, setPhotoUri] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Permissão Negada', 'Você precisa permitir o acesso à galeria.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setPhotoUri(result.assets[0].uri); 
        }
    };

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Erro', 'Preencha todos os campos.');
            return;
        }
        
        try {
            // 1. Registra o usuário no DB para obter o ID
            const user = await register(email, name, password);
            
            // 2. Se houver foto, salva o arquivo localmente e atualiza o DB
            if (photoUri) {
                // O serviço saveProfilePhoto deve receber o ID e o URI temporário
                await saveProfilePhoto(user.id, photoUri);
            }
            
            Alert.alert('Conta Criada!', `Bem-vindo(a), ${user.name}.`);
            navigation.navigate('Login'); // Redireciona para o login após sucesso
        } 
        catch (error) {
            // Trata erros de email duplicado ou falha de DB/rede
            Alert.alert('Erro no Cadastro', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tela de Registro</Text>
            
            {/* ⬇️ Componente para selecionar/visualizar a foto ⬇️ */}
            <TouchableOpacity onPress={pickImage} style={styles.photoContainer}>
                {photoUri ? (
                    <Image source={{ uri: photoUri }} style={styles.profilePhoto} />
                ) : (
                    <Text style={styles.photoPlaceholder}>Selecione a Foto</Text>
                )}
            </TouchableOpacity>
            {/* ⬆️ Fim do componente de foto ⬆️ */}

            <TextInput placeholder="Nome Completo" value={name} onChangeText={setName} style={styles.input} />
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={styles.input} />
            <TextInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
            
            <Button title="REGISTRAR" onPress={handleRegister} />
            
            <View style={{ marginTop: 10 }}>
                <Button title="Voltar ao Login" onPress={() => navigation.goBack()} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24, 
        marginBottom: 30,
        fontWeight: 'bold',
    },
    input: {
        width: '80%', 
        height: 40, 
        borderColor: '#ccc', 
        borderWidth: 1, 
        marginBottom: 15, 
        paddingLeft: 10,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    photoContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        overflow: 'hidden'
    },
    profilePhoto: {
        width: '100%',
        height: '100%',
    },
    photoPlaceholder: {
        color: '#666',
        textAlign: 'center',
        fontSize: 12,
    }
});
