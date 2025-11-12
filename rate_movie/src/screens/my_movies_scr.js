// src/screens/my_movies_scr.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useMovies } from '../contexts/MoviesContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { removeWatchedMovie } from '../services/movies_service';
import { getLoggedInUserId } from '../services/auth_servc';

export default function MyMoviesScreen() {
    const navigation = useNavigation();
    const { watchedMovies, loadWatchedMovies, refreshMovies, loading } = useMovies();
    const [deleting, setDeleting] = useState(false);

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
                        setDeleting(true);
                        try {
                            const userId = await getLoggedInUserId();
                            if (userId) {
                                await removeWatchedMovie(userId, movieId);
                                await refreshMovies();
                                Alert.alert('Sucesso', 'Filme removido da lista.');
                            }
                        } catch (error) {
                            Alert.alert('Erro', error.message);
                        } finally {
                            setDeleting(false);
                        }
                    },
                },
            ]
        );
    };

    const renderStars = (rating) => {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += i <= rating ? '⭐' : '☆';
        }
        return stars;
    };

    const renderMovieItem = ({ item }) => (
        <TouchableOpacity
            style={styles.movieCard}
            onPress={() => navigation.navigate('MovieDetails', { movieId: item.movie_id })}
            accessibilityLabel={`Filme ${item.title}, avaliado com ${item.user_rating} estrelas`}
            accessibilityHint="Toque para ver detalhes ou editar avaliação"
            accessibilityRole="button"
        >
            {item.poster_path ? (
                <Image
                    source={{ uri: item.poster_path }}
                    style={styles.poster}
                    accessibilityLabel={`Pôster do filme ${item.title}`}
                />
            ) : (
                <View style={[styles.poster, styles.noPoster]}>
                    <Text style={styles.noPosterText}>Sem Imagem</Text>
                </View>
            )}
            
            <View style={styles.movieInfo}>
                <Text style={styles.movieTitle} numberOfLines={2}>
                    {item.title}
                </Text>
                
                <Text style={styles.releaseDate}>
                    {item.release_date ? new Date(item.release_date).getFullYear() : 'N/A'}
                </Text>
                
                <View style={styles.ratingsContainer}>
                    <Text style={styles.tmdbRating}>
                        TMDb: ⭐ {item.rating?.toFixed(1) || 'N/A'}
                    </Text>
                </View>
                
                <View style={styles.userRatingContainer}>
                    <Text style={styles.userRatingLabel}>Sua avaliação:</Text>
                    <Text style={styles.userRatingStars}>
                        {renderStars(item.user_rating)}
                    </Text>
                </View>
                
                <Text style={styles.watchedDate}>
                    Assistido em: {new Date(item.watched_date).toLocaleDateString('pt-BR')}
                </Text>
            </View>
            
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

            <FlatList
                data={watchedMovies}
                renderItem={renderMovieItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
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
                }
            />
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
    poster: {
        width: 80,
        height: 120,
        backgroundColor: '#e0e0e0',
    },
    noPoster: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    noPosterText: {
        color: '#999',
        fontSize: 10,
        textAlign: 'center',
    },
    movieInfo: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    movieTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    releaseDate: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    ratingsContainer: {
        marginBottom: 4,
    },
    tmdbRating: {
        fontSize: 12,
        color: '#999',
    },
    userRatingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    userRatingLabel: {
        fontSize: 12,
        color: '#333',
        marginRight: 5,
    },
    userRatingStars: {
        fontSize: 14,
    },
    watchedDate: {
        fontSize: 11,
        color: '#999',
        fontStyle: 'italic',
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
