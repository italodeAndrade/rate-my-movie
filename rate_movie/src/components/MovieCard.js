// src/components/MovieCard.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

/**
 * Componente reutilizável para renderizar informações de um filme
 * Usado em SearchScreen e MyMoviesScreen
 */
export const MovieCard = ({ movie, showUserRating = false, showWatchedDate = false }) => {
    const renderStars = (rating) => {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += i <= rating ? '⭐' : '☆';
        }
        return stars;
    };

    // Determina qual campo usar baseado no tipo de tela
    const posterPath = movie.posterPath || movie.poster_path;
    const title = movie.title;
    const releaseDate = movie.releaseDate || movie.release_date;
    const voteAverage = movie.voteAverage || movie.rating;

    return (
        <>
            {posterPath ? (
                <Image
                    source={{ uri: posterPath }}
                    style={styles.poster}
                    accessibilityLabel={`Pôster do filme ${title}`}
                />
            ) : (
                <View style={[styles.poster, styles.noPoster]}>
                    <Text style={styles.noPosterText}>Sem Imagem</Text>
                </View>
            )}
            
            <View style={styles.movieInfo}>
                <Text style={styles.movieTitle} numberOfLines={2}>
                    {title}
                </Text>
                
                <Text style={styles.releaseDate}>
                    {releaseDate ? new Date(releaseDate).getFullYear() : 'N/A'}
                </Text>
                
                <View style={styles.ratingContainer}>
                    <Text style={styles.rating}>
                        {showUserRating ? 'TMDb: ' : ''}⭐ {voteAverage?.toFixed(1) || 'N/A'}
                    </Text>
                </View>
                
                {showUserRating && movie.user_rating && (
                    <View style={styles.userRatingContainer}>
                        <Text style={styles.userRatingLabel}>Sua avaliação:</Text>
                        <Text style={styles.userRatingStars}>
                            {renderStars(movie.user_rating)}
                        </Text>
                    </View>
                )}
                
                {showWatchedDate && movie.watched_date && (
                    <Text style={styles.watchedDate}>
                        Assistido em: {new Date(movie.watched_date).toLocaleDateString('pt-BR')}
                    </Text>
                )}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
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
    ratingContainer: {
        marginBottom: 4,
    },
    rating: {
        fontSize: 12,
        color: '#f39c12',
        fontWeight: '600',
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
});
