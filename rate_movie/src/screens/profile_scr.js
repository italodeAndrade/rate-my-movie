// src/screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
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
        Alert.alert(
            "Sair",
            "Deseja realmente sair da sua conta?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Sair",
                    style: "destructive",
                    onPress: async () => {
                        await signOut();
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Home' }],
                        });
                    }
                }
            ]
        );
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
            <View style={styles.profileHeader}>
                <Image 
                    source={photoSource}
                    style={styles.profilePhoto}
                    accessibilityLabel={`Foto de perfil de ${user.name}`}
                />
                
                <Text style={styles.name}>{user.name || 'Nome não definido'}</Text>
                <Text style={styles.email}>{user.email}</Text>
            </View>

            <View style={styles.menuSection}>
                <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('MyMovies')}
                    accessibilityLabel="Ver meus filmes"
                    accessibilityHint="Toque para ver sua lista de filmes assistidos"
                    accessibilityRole="button"
                >
                    <Text style={styles.menuIcon}>🎞️</Text>
                    <Text style={styles.menuText}>Meus Filmes Assistidos</Text>
                    <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('Search')}
                    accessibilityLabel="Buscar filmes"
                    accessibilityHint="Toque para buscar novos filmes"
                    accessibilityRole="button"
                >
                    <Text style={styles.menuIcon}>🔍</Text>
                    <Text style={styles.menuText}>Buscar Filmes</Text>
                    <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity 
                style={styles.logoutButton}
                onPress={handleLogout}
                accessibilityLabel="Sair da conta"
                accessibilityHint="Toque para fazer logout"
                accessibilityRole="button"
            >
                <Text style={styles.logoutButtonText}>🚪 SAIR</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f5f5f5' 
    },
    center: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    profileHeader: {
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingVertical: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    profilePhoto: { 
        width: 120, 
        height: 120, 
        borderRadius: 60, 
        marginBottom: 20,
        backgroundColor: '#CCC',
        borderWidth: 3,
        borderColor: '#007AFF',
    },
    name: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 5,
        color: '#333',
    },
    email: { 
        fontSize: 16, 
        color: '#666' 
    },
    menuSection: {
        marginTop: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#e0e0e0',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        minHeight: 70,
    },
    menuIcon: {
        fontSize: 24,
        marginRight: 15,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    menuArrow: {
        fontSize: 24,
        color: '#ccc',
    },
    logoutButton: { 
        margin: 20,
        backgroundColor: '#ff3b30',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        minHeight: 50,
        justifyContent: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});