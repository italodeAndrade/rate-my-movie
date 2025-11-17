const BASE_URL = 'https://ghibliapi.vercel.app';

export const searchMovies = async (query) => {
  if (!query.trim()) {
    return [];
  }

  try {
    const response = await fetch(`${BASE_URL}/films`);
    const data = await response.json();
    
    const queryLower = query.toLowerCase();
    const filtered = data.filter(movie => 
      movie.title.toLowerCase().includes(queryLower) ||
      movie.original_title.toLowerCase().includes(queryLower) ||
      movie.description.toLowerCase().includes(queryLower)
    );
    
    return filtered.map(movie => ({
      id: movie.id,
      title: movie.title,
      overview: movie.description || 'Sem descrição disponível',
      posterPath: movie.image,
      releaseDate: movie.release_date,
      voteAverage: parseInt(movie.rt_score) / 10,
      backdropPath: movie.movie_banner,
    }));
  } catch (error) {
    throw new Error('Falha ao buscar filmes. Verifique sua conexão.');
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const response = await fetch(`${BASE_URL}/films/${movieId}`);
    const movie = await response.json();
    
    return {
      id: movie.id,
      title: movie.title,
      overview: movie.description || 'Sem descrição disponível',
      posterPath: movie.image,
      backdropPath: movie.movie_banner,
      releaseDate: movie.release_date,
      voteAverage: parseInt(movie.rt_score) / 10,
      runtime: parseInt(movie.running_time),
      genres: 'Animação, Aventura, Fantasia',
      originalLanguage: movie.original_title_romanised ? 'ja' : 'en',
    };
  } catch (error) {
    throw new Error('Falha ao carregar detalhes do filme.');
  }
};

export const getPopularMovies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/films`);
    const data = await response.json();
    
    return data.map(movie => ({
      id: movie.id,
      title: movie.title,
      overview: movie.description || 'Sem descrição disponível',
      posterPath: movie.image,
      releaseDate: movie.release_date,
      voteAverage: parseInt(movie.rt_score) / 10,
    }));
  } catch (error) {
    console.error('Erro ao carregar filmes:', error);
    throw new Error('Falha ao carregar filmes.');
  }
};
