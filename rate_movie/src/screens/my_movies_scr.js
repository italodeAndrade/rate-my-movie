// src/screens/my_movies_scr.js
import React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useMovies } from '../contexts/MoviesContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { removeWatchedMovie } from '../services/movies_service';
import { getLoggedInUserId } from '../services/auth_servc';
import { MovieCard } from '../components/MovieCard';

export default function MyMoviesScreen() {
    const navigation = useNavigation();
    const { watchedMovies, loadWatchedMovies, refreshMovies, loading } = useMovies();

    // Recarrega os filmes sempre que a tela é focada
    useFocusEffect(
        React.useCallback(() => {
            loadWatchedMovies();
        }, [])
    );

    const handleRemoveMovie = (movieId, movieTitle) => {
        Alert.alert(
            'Remover Filme',
            `Deseja remover "${movieTitle}" da sua lista?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Remover',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const userId = await getLoggedInUserId();
                            if (userId) {
                                await removeWatchedMovie(userId, movieId);
                                await refreshMovies();
                                Alert.alert('Sucesso', 'Filme removido da lista.');
                            }
                        } catch (error) {
                            Alert.alert('Erro', error.message);
                        }
                    },
                },
            ]
        );
    };

    const renderMovieItem = ({ item }) => (
        <TouchableOpacity
            style={styles.movieCard}
            onPress={() => navigation.navigate('MovieDetails', { movieId: item.movie_id })}
            accessibilityLabel={`Filme ${item.title}, avaliado com ${item.user_rating} estrelas`}
            accessibilityHint="Toque para ver detalhes ou editar avaliação"
            accessibilityRole="button"
        >
            <MovieCard 
                movie={item} 
                showUserRating={true} 
                showWatchedDate={true} 
            />
            
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleRemoveMovie(item.movie_id, item.title)}
                accessibilityLabel="Remover filme"
                accessibilityHint={`Toque para remover ${item.title} da sua lista`}
                accessibilityRole="button"
            >
                <Text style={styles.deleteButtonText}>🗑️</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={{marginTop: 10}}>Carregando filmes...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Meus Filmes Assistidos</Text>
                <Text style={styles.headerSubtitle}>
                    {watchedMovies.length} filme{watchedMovies.length !== 1 ? 's' : ''}
                </Text>
            </View>

            {watchedMovies.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyTitle}>🎬</Text>
                    <Text style={styles.emptyText}>
                        Você ainda não adicionou nenhum filme.
                    </Text>
                    <Text style={styles.emptySubtext}>
                        Busque por filmes e adicione suas avaliações!
                    </Text>
                    <TouchableOpacity
                        style={styles.searchButton}
                        onPress={() => navigation.navigate('Search')}
                        accessibilityLabel="Buscar filmes"
                        accessibilityHint="Toque para ir para a tela de busca"
                        accessibilityRole="button"
                    >
                        <Text style={styles.searchButtonText}>🔍 Buscar Filmes</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={watchedMovies}
                    renderItem={renderMovieItem}
                    keyExtractor={(item, index) => item.id ? item.id.toString() : `movie-${index}`}
                    contentContainerStyle={styles.listContainer}
                    extraData={watchedMovies}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#fff',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        padding: 10,
        flexGrow: 1,
    },
    movieCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    deleteButton: {
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff3b30',
        minWidth: 44,
        minHeight: 44,
    },
    deleteButtonText: {
        fontSize: 24,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        minHeight: 400,
    },
    emptyTitle: {
        fontSize: 60,
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 10,
        color: '#333',
    },
    emptySubtext: {
        fontSize: 14,
        textAlign: 'center',
        color: '#666',
        marginBottom: 30,
    },
    searchButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        minHeight: 44,
        justifyContent: 'center',
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
