// src/contexts/MoviesContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWatchedMovies } from '../services/movies_service';
import { getLoggedInUserId } from '../services/auth_servc';

const MoviesContext = createContext();

export const MoviesProvider = ({ children }) => {
    const [watchedMovies, setWatchedMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    // Carrega os filmes assistidos do usuário atual
    const loadWatchedMovies = async () => {
        setLoading(true);
        try {
            const userId = await getLoggedInUserId();
            setCurrentUserId(userId);
            
            if (userId) {
                const movies = await getWatchedMovies(userId);
                setWatchedMovies(movies);
            } else {
                setWatchedMovies([]);
            }
        } catch (error) {
            setWatchedMovies([]);
        } finally {
            setLoading(false);
        }
    };

    // Recarrega os filmes (útil após adicionar/remover)
    const refreshMovies = async () => {
        await loadWatchedMovies();
    };

    // Limpa o contexto (útil no logout)
    const clearMovies = () => {
        setWatchedMovies([]);
        setCurrentUserId(null);
    };

    // Verifica se um filme já foi assistido
    const isMovieWatched = (movieId) => {
        return watchedMovies.some(movie => movie.movie_id === movieId);
    };

    // Busca a avaliação do usuário para um filme específico
    const getUserRating = (movieId) => {
        const movie = watchedMovies.find(m => m.movie_id === movieId);
        return movie ? movie.user_rating : null;
    };

    return (
        <MoviesContext.Provider
            value={{
                watchedMovies,
                loading,
                currentUserId,
                loadWatchedMovies,
                refreshMovies,
                clearMovies,
                isMovieWatched,
                getUserRating,
            }}
        >
            {children}
        </MoviesContext.Provider>
    );
};

// Hook personalizado para usar o contexto
export const useMovies = () => {
    const context = useContext(MoviesContext);
    if (!context) {
        throw new Error('useMovies deve ser usado dentro de um MoviesProvider');
    }
    return context;
};
