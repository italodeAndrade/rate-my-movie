import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, Image, StyleSheet } from 'react-native';
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
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>Preencha seus dados para começar</Text>
            
            <TouchableOpacity 
                onPress={pickImage} 
                style={styles.photoContainer}
                accessibilityLabel="Foto de perfil"
                accessibilityHint="Toque para selecionar uma foto da galeria"
                accessibilityRole="button"
            >
                {photoUri ? (
                    <Image 
                        source={{ uri: photoUri }} 
                        style={styles.profilePhoto}
                        accessibilityLabel="Foto de perfil selecionada"
                    />
                ) : (
                    <>
                        <Text style={styles.photoIcon}>📷</Text>
                        <Text style={styles.photoPlaceholder}>Adicionar Foto</Text>
                    </>
                )}
            </TouchableOpacity>

            <TextInput 
                placeholder="Nome Completo" 
                value={name} 
                onChangeText={setName} 
                style={styles.input}
                accessibilityLabel="Campo de nome completo"
                accessibilityHint="Digite seu nome completo"
            />
            
            <TextInput 
                placeholder="E-mail" 
                value={email} 
                onChangeText={setEmail} 
                keyboardType="email-address" 
                autoCapitalize="none" 
                style={styles.input}
                accessibilityLabel="Campo de e-mail"
                accessibilityHint="Digite seu e-mail"
            />
            
            <TextInput 
                placeholder="Senha" 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry 
                style={styles.input}
                accessibilityLabel="Campo de senha"
                accessibilityHint="Digite uma senha segura"
            />
            
            <TouchableOpacity 
                style={styles.registerButton} 
                onPress={handleRegister}
                accessibilityLabel="Botão criar conta"
                accessibilityHint="Toque para criar sua conta"
                accessibilityRole="button"
            >
                <Text style={styles.registerButtonText}>CRIAR CONTA</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                accessibilityLabel="Voltar"
                accessibilityHint="Toque para voltar à tela anterior"
                accessibilityRole="button"
            >
                <Text style={styles.backButtonText}>Já tem uma conta? Entre aqui</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28, 
        marginBottom: 10,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        maxWidth: 400,
        padding: 15,
        borderColor: '#ddd', 
        borderWidth: 1, 
        marginBottom: 15, 
        borderRadius: 8,
        backgroundColor: 'white',
        fontSize: 16,
        minHeight: 50,
    },
    photoContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: '#007AFF',
    },
    profilePhoto: {
        width: '100%',
        height: '100%',
    },
    photoIcon: {
        fontSize: 40,
        marginBottom: 5,
    },
    photoPlaceholder: {
        color: '#666',
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '600',
    },
    registerButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        width: '100%',
        maxWidth: 400,
        minHeight: 50,
        justifyContent: 'center',
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: {
        marginTop: 20,
        padding: 10,
        minHeight: 44,
        justifyContent: 'center',
    },
    backButtonText: {
        color: '#007AFF',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});
