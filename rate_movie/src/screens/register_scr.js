import React, { useState, useRef } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { register } from '../services/auth_servc';
import { saveProfilePhoto } from '../services/img_servc';
import * as ImagePicker from 'expo-image-picker';

// Importando os componentes acessíveis que criamos
import AccessibleInput from '../components/AccessibleInput';
import AccessibleButton from '../components/AccessibleButton';
import AccessibleImage from '../components/AccessibleImage';

export default function RegisterScreen({ navigation }) {
    // 1. Estados
    const [photoUri, setPhotoUri] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    // 2. Refs para Gerenciamento de Foco (RF07)
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

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
        if (!photoUri || !name || !email || !password) {
            Alert.alert('Erro', 'Preencha todos os campos.');
            return;
        }

        try {
            const user = await register(email, name, password);

            if (photoUri) {
                await saveProfilePhoto(user.id, photoUri);
            }

            Alert.alert('Conta Criada!', `Bem-vindo(a), ${user.name}.`);
            navigation.navigate('Home');
        }
        catch (error) {
            Alert.alert('Erro no Cadastro', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title} accessibilityRole="header">Criar Conta</Text>
            <Text style={styles.subtitle}>Preencha seus dados para começar</Text>

            <AccessibleButton
                onPress={pickImage}
                style={styles.photoContainer}
                label={photoUri ? "Alterar foto de perfil" : "Adicionar foto de perfil"}
            >
                {photoUri ? (
                    <AccessibleImage
                        source={{ uri: photoUri }}
                        style={styles.profilePhoto}
                        alt="Sua foto de perfil selecionada"
                    />
                ) : (
                    <>
                        <Text style={styles.photoIcon} importantForAccessibility="no">📷</Text>
                        <Text style={styles.photoPlaceholder}>Adicionar Foto</Text>
                    </>
                )}
            </AccessibleButton>

            {/* Formulário com Foco Gerenciado */}
            <View style={styles.formContainer}>
                <AccessibleInput
                    label="Nome Completo"
                    placeholder="Ex: Otávio Silva"
                    value={name}
                    onChangeText={setName}
                    // Pula para o próximo campo (email)
                    returnKeyType="next"
                    onSubmitEditing={() => emailRef.current?.focus()}
                />

                <AccessibleInput
                    ref={emailRef} // Recebe o foco do nome
                    label="E-mail"
                    placeholder="exemplo@email.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    // Pula para o próximo campo (senha)
                    returnKeyType="next"
                    onSubmitEditing={() => passwordRef.current?.focus()}
                />

                <AccessibleInput
                    ref={passwordRef} // Recebe o foco do email
                    label="Senha"
                    placeholder="Crie uma senha segura"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    // Fecha o teclado e tenta registrar
                    returnKeyType="done"
                    onSubmitEditing={handleRegister}
                />
            </View>

            <AccessibleButton
                style={styles.registerButton}
                onPress={handleRegister}
                label="Finalizar cadastro e criar conta"
            >
                <Text style={styles.registerButtonText}>CRIAR CONTA</Text>
            </AccessibleButton>

            <AccessibleButton
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                label="Voltar para a tela de login"
            >
                <Text style={styles.backButtonText}>Já tem uma conta? Entre aqui</Text>
            </AccessibleButton>
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
    // Container para limitar a largura dos inputs em tablets/web
    formContainer: {
        width: '100%',
        maxWidth: 400,
    },
    photoContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#E0E0E0',
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
        borderRadius: 8,
        marginTop: 10,
        width: '100%',
        maxWidth: 400,
        minHeight: 50,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: {
        marginTop: 20,
        padding: 10,
    },
    backButtonText: {
        color: '#007AFF',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});