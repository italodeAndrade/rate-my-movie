// src/services/movies_service.js
import { getDB } from './database';

/**
 * Adiciona um filme à lista de assistidos do usuário
 * @param {number} userId - ID do usuário
 * @param {object} movie - Dados do filme
 * @param {number} userRating - Avaliação do usuário (1-5)
 * @returns {Promise<number>} ID do registro inserido
 */
export const addWatchedMovie = async (userId, movie, userRating) => {
    const db = getDB();
    
    const query = `
        INSERT INTO watched_movies 
        (user_id, movie_id, title, poster_path, overview, release_date, rating, user_rating)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    try {
        const result = await db.runAsync(query, [
            userId,
            movie.id,
            movie.title,
            movie.posterPath,
            movie.overview,
            movie.releaseDate,
            movie.voteAverage,
            userRating
        ]);
        
        return result.lastInsertRowId;
    } catch (error) {
        if (error.message && error.message.includes('UNIQUE constraint failed')) {
            throw new Error('Você já avaliou este filme.');
        }
        console.error('Erro ao adicionar filme assistido:', error);
        throw new Error('Erro ao salvar filme.');
    }
};

/**
 * Atualiza a avaliação de um filme já assistido
 * @param {number} userId - ID do usuário
 * @param {number} movieId - ID do filme
 * @param {number} newRating - Nova avaliação
 * @returns {Promise<void>}
 */
export const updateMovieRating = async (userId, movieId, newRating) => {
    const db = getDB();
    
    const query = `
        UPDATE watched_movies 
        SET user_rating = ?, watched_date = CURRENT_TIMESTAMP
        WHERE user_id = ? AND movie_id = ?
    `;
    
    try {
        await db.runAsync(query, [newRating, userId, movieId]);
    } catch (error) {
        console.error('Erro ao atualizar avaliação:', error);
        throw new Error('Erro ao atualizar avaliação.');
    }
};

/**
 * Remove um filme da lista de assistidos
 * @param {number} userId - ID do usuário
 * @param {number} movieId - ID do filme
 * @returns {Promise<void>}
 */
export const removeWatchedMovie = async (userId, movieId) => {
    const db = getDB();
    const query = 'DELETE FROM watched_movies WHERE user_id = ? AND movie_id = ?';
    
    try {
        await db.runAsync(query, [userId, movieId]);
    } catch (error) {
        console.error('Erro ao remover filme:', error);
        throw new Error('Erro ao remover filme.');
    }
};

/**
 * Busca todos os filmes assistidos de um usuário
 * @param {number} userId - ID do usuário
 * @returns {Promise<Array>} Lista de filmes assistidos
 */
export const getWatchedMovies = async (userId) => {
    const db = getDB();
    const query = `
        SELECT * FROM watched_movies 
        WHERE user_id = ? 
        ORDER BY watched_date DESC
    `;
    
    try {
        const movies = await db.getAllAsync(query, [userId]);
        return movies || [];
    } catch (error) {
        console.error('Erro ao buscar filmes assistidos:', error);
        throw new Error('Erro ao carregar seus filmes.');
    }
};

/**
 * Verifica se um filme já foi assistido pelo usuário
 * @param {number} userId - ID do usuário
 * @param {number} movieId - ID do filme
 * @returns {Promise<object|null>} Dados do filme se já foi assistido, null caso contrário
 */
export const getWatchedMovie = async (userId, movieId) => {
    const db = getDB();
    const query = 'SELECT * FROM watched_movies WHERE user_id = ? AND movie_id = ?';
    
    try {
        const movie = await db.getFirstAsync(query, [userId, movieId]);
        return movie || null;
    } catch (error) {
        console.error('Erro ao verificar filme:', error);
        return null;
    }
};
