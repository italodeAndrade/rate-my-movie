// src/services/tmdb_service.js
// API Key do TMDb - Obtenha a sua em: https://www.themoviedb.org/settings/api
const API_KEY = '38e5543f64b03b141326816c0c4a08c7'; // Chave válida do TMDb
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

/**
 * Busca filmes pela query de pesquisa
 * @param {string} query - Termo de busca
 * @returns {Promise<Array>} Lista de filmes
 */
export const searchMovies = async (query) => {
  if (!query.trim()) {
    return [];
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=1`
    );
    
    const data = await response.json();
    
    if (data.results) {
      return data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview || 'Sem descrição disponível',
        posterPath: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
        releaseDate: movie.release_date,
        voteAverage: movie.vote_average,
        backdropPath: movie.backdrop_path ? `${IMAGE_BASE_URL}${movie.backdrop_path}` : null,
      }));
    }
    
    return [];
  } catch (error) {
    throw new Error('Falha ao buscar filmes. Verifique sua conexão.');
  }
};

/**
 * Busca detalhes completos de um filme específico
 * @param {number} movieId - ID do filme no TMDb
 * @returns {Promise<object>} Detalhes do filme
 */
export const getMovieDetails = async (movieId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=pt-BR`
    );
    
    const movie = await response.json();
    
    return {
      id: movie.id,
      title: movie.title,
      overview: movie.overview || 'Sem descrição disponível',
      posterPath: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
      backdropPath: movie.backdrop_path ? `${IMAGE_BASE_URL}${movie.backdrop_path}` : null,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
      runtime: movie.runtime,
      genres: movie.genres?.map(g => g.name).join(', ') || 'N/A',
      originalLanguage: movie.original_language,
    };
  } catch (error) {
    throw new Error('Falha ao carregar detalhes do filme.');
  }
};

/**
 * Busca filmes populares
 * @returns {Promise<Array>} Lista de filmes populares
 */
export const getPopularMovies = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`
    );
    
    const data = await response.json();
    
    if (data.results) {
      return data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview || 'Sem descrição disponível',
        posterPath: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
        releaseDate: movie.release_date,
        voteAverage: movie.vote_average,
      }));
    }
    
    return [];
  } catch (error) {
    return [];
  }
};
