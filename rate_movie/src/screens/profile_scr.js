// src/screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getLoggedInUserId, signOut } from '../services/auth_servc'; 
import { getUserProfile } from '../services/profile_servc'; 
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen() {
    const navigation = useNavigation();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Usa useFocusEffect para recarregar o perfil toda vez que a tela é focada
    useFocusEffect(
        React.useCallback(() => {
            loadProfile();
            return () => {}; // Cleanup function, se necessário
        }, [])
    );

    const loadProfile = async () => {
        setLoading(true);
        const userId = await getLoggedInUserId();

        if (userId) {
            try {
                const profileData = await getUserProfile(userId);
                setUser(profileData);
            } catch (error) {
                Alert.alert("Erro", "Falha ao carregar dados do perfil.");
            }
        } else {
            // Se não houver ID (erro de sessão), volta para o Login
            navigation.navigate('Login');
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await signOut(); // Limpa a sessão do Async Storage
        Alert.alert("Sucesso", "Sessão encerrada!");
        navigation.navigate('Home'); // Redireciona para a tela inicial
    };

    if (loading) {
        return <View style={styles.center}><ActivityIndicator size="large" color="#007AFF" /></View>;
    }

    if (!user) {
        return <View style={styles.center}><Text>Usuário não encontrado.</Text></View>;
    }
    
    // A foto será carregada do URI local (file:///)
    const photoSource = user.photo_path 
        ? { uri: user.photo_path } 
        : require('../../assets/placeholder.jpg'); // Adicione uma imagem de placeholder no assets/

    return (
        <View style={styles.container}>
            <Image 
                source={photoSource}
                style={styles.profilePhoto} 
            />
            
            <Text style={styles.name}>{user.name || 'Nome não definido'}</Text>
            <Text style={styles.email}>{user.email}</Text>

            <View style={styles.logoutButton}>
                <Button title="LOGOUT" onPress={handleLogout} color="#C00" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', paddingTop: 50, backgroundColor: '#f0f0f0' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    profilePhoto: { 
        width: 120, 
        height: 120, 
        borderRadius: 60, 
        marginBottom: 20,
        backgroundColor: '#CCC' // Cor de fundo caso a imagem falhe
    },
    name: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
    email: { fontSize: 16, color: '#666' },
    logoutButton: { marginTop: 40, width: '80%' }
});