import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { getMovieDetails } from '../services/tmdb_service';
import { addWatchedMovie, updateMovieRating, getWatchedMovie } from '../services/movies_service';
import { getLoggedInUserId } from '../services/auth_servc';
import { useMovies } from '../contexts/MoviesContext';

import AccessibleImage from '../components/AccessibleImage';
import AccessibleButton from '../components/AccessibleButton';

export default function MovieDetailsScreen({ route, navigation }) {
    const { movieId } = route.params;
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedRating, setSelectedRating] = useState(0);
    const [alreadyWatched, setAlreadyWatched] = useState(false);
    const { refreshMovies } = useMovies();

    useEffect(() => {
        loadMovieDetails();
        checkIfWatched();
    }, [movieId]);

    const loadMovieDetails = async () => {
        try {
            const details = await getMovieDetails(movieId);
            setMovie(details);
        } catch (error) {
            Alert.alert('Erro', error.message);
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const checkIfWatched = async () => {
        try {
            const userId = await getLoggedInUserId();
            if (userId) {
                const watchedMovie = await getWatchedMovie(userId, movieId);
                if (watchedMovie) {
                    setAlreadyWatched(true);
                    setSelectedRating(watchedMovie.user_rating);
                }
            }
        } catch (error) {
            // Silenciosamente falha
        }
    };

    const handleSaveRating = async () => {
        if (selectedRating === 0) {
            Alert.alert('Atenção', 'Selecione uma avaliação de 1 a 5 estrelas.');
            return;
        }
        try {
            const userId = await getLoggedInUserId();
            if (!userId) {
                Alert.alert('Erro', 'Você precisa estar logado.');
                return;
            }
            if (alreadyWatched) {
                await updateMovieRating(userId, movieId, selectedRating);
                Alert.alert('Sucesso', 'Avaliação atualizada!');
            } else {
                await addWatchedMovie(userId, movie, selectedRating);
                setAlreadyWatched(true);
                Alert.alert('Sucesso', 'Filme adicionado aos seus assistidos!');
            }
            await refreshMovies();
        } catch (error) {
            Alert.alert('Erro', error.message);
        }
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <AccessibleButton
                    key={i}
                    onPress={() => setSelectedRating(i)}
                    style={styles.starButton}
                    label={`${i} estrela${i > 1 ? 's' : ''}`}
                    accessibilityHint={`Toque para avaliar com ${i} estrela${i > 1 ? 's' : ''}`}
                >
                    <Text style={styles.star} importantForAccessibility="no">
                        {i <= selectedRating ? '⭐' : '☆'}
                    </Text>
                </AccessibleButton>
            );
        }
        return stars;
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (!movie) {
        return (
            <View style={styles.centerContainer}>
                <Text>Filme não encontrado</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {movie.backdropPath && (
                <AccessibleImage
                    source={{ uri: movie.backdropPath }}
                    style={styles.backdrop}
                    alt={`Imagem de fundo do filme ${movie.title}`}
                />
            )}

            <View style={styles.content}>
                <View style={styles.headerContainer}>
                    {movie.posterPath && (
                        <AccessibleImage
                            source={{ uri: movie.posterPath }}
                            style={styles.poster}
                            alt={`Pôster do filme ${movie.title}`}
                        />
                    )}
                    <View style={styles.headerInfo}>
                        <Text style={styles.title}>{movie.title}</Text>
                        <Text style={styles.releaseYear}>
                            {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}
                        </Text>
                        <View style={styles.ratingContainer}>
                            <Text style={styles.tmdbRating}>
                                <Text importantForAccessibility="no">⭐ </Text>
                                {movie.voteAverage?.toFixed(1) || 'N/A'} / 10
                            </Text>
                        </View>
                        {movie.runtime && (
                            <Text style={styles.runtime}>
                                <Text importantForAccessibility="no">⏱️ </Text>
                                {movie.runtime} min
                            </Text>
                        )}
                    </View>
                </View>

                {movie.genres && (
                    <View style={styles.genresContainer}>
                        <Text style={styles.genres}>{movie.genres}</Text>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sinopse</Text>
                    <Text style={styles.overview}>{movie.overview}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        {alreadyWatched ? 'Atualizar Sua Avaliação' : 'Avaliar Este Filme'}
                    </Text>
                    <View style={styles.starsContainer}>{renderStars()}</View>
                    <Text style={styles.ratingText}>
                        {selectedRating > 0 ? `${selectedRating} estrela${selectedRating > 1 ? 's' : ''}` : 'Nenhuma avaliação'}
                    </Text>
                </View>

                <AccessibleButton
                    style={styles.saveButton}
                    onPress={handleSaveRating}
                    label={alreadyWatched ? 'Atualizar avaliação' : 'Salvar filme'}
                    accessibilityHint={alreadyWatched ? 'Toque para atualizar sua avaliação' : 'Toque para adicionar aos filmes assistidos'}
                >
                    <Text style={styles.saveButtonText}>
                        <Text importantForAccessibility="no">
                            {alreadyWatched ? '✏️ ' : '💾 '}
                        </Text>
                        {alreadyWatched ? 'Atualizar Avaliação' : 'Salvar nos Assistidos'}
                    </Text>
                </AccessibleButton>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        width: '100%',
        height: 200,
        backgroundColor: '#e0e0e0',
    },
    content: {
        padding: 15,
    },
    headerContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    poster: {
        width: 120,
        height: 180,
        borderRadius: 8,
        backgroundColor: '#e0e0e0',
    },
    headerInfo: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    releaseYear: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    ratingContainer: {
        marginBottom: 8,
    },
    tmdbRating: {
        fontSize: 16,
        fontWeight: '600',
        color: '#f39c12',
    },
    runtime: {
        fontSize: 14,
        color: '#666',
    },
    genresContainer: {
        marginBottom: 20,
    },
    genres: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '500',
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    overview: {
        fontSize: 15,
        lineHeight: 22,
        color: '#333',
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 15,
    },
    starButton: {
        padding: 8,
        minWidth: 44,
        minHeight: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    star: {
        fontSize: 32,
    },
    ratingText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
    },
    saveButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 20,
        minHeight: 52,
        justifyContent: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});