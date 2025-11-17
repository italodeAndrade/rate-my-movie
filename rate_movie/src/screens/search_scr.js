// src/screens/search_scr.js
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert
} from 'react-native';
import { searchMovies, getPopularMovies } from '../services/tmdb_service';
import { useNavigation } from '@react-navigation/native';
import { MovieCard } from '../components/MovieCard';

export default function SearchScreen() {
    const navigation = useNavigation();
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    // Carrega filmes populares ao montar o componente
    React.useEffect(() => {
        loadPopularMovies();
    }, []);

    const loadPopularMovies = async () => {
        setLoading(true);
        try {
            const popularMovies = await getPopularMovies();
            setMovies(popularMovies);
        } catch (error) {
            Alert.alert('Erro', 'Falha ao carregar filmes populares.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!query.trim()) {
            Alert.alert('Atenção', 'Digite algo para buscar.');
            return;
        }

        setLoading(true);
        setSearched(true);
        
        try {
            const results = await searchMovies(query);
            setMovies(results);
            
            if (results.length === 0) {
                Alert.alert('Sem resultados', 'Nenhum filme encontrado.');
            }
        } catch (error) {
            Alert.alert('Erro', error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderMovieItem = ({ item }) => (
        <TouchableOpacity
            style={styles.movieCard}
            onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}
            accessibilityLabel={`Filme ${item.title}`}
            accessibilityHint="Toque para ver detalhes do filme"
            accessibilityRole="button"
        >
            <MovieCard movie={item} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar filmes..."
                    value={query}
                    onChangeText={setQuery}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                    accessibilityLabel="Campo de busca de filmes"
                    accessibilityHint="Digite o nome do filme e pressione buscar"
                />
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={handleSearch}
                    accessibilityLabel="Botão buscar"
                    accessibilityHint="Toque para buscar filmes"
                    accessibilityRole="button"
                >
                    <Text style={styles.searchButtonText}>🔍</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            ) : (
                <>
                    <Text style={styles.sectionTitle}>
                        {searched ? 'Resultados da Busca' : 'Filmes Populares'}
                    </Text>
                    <FlatList
                        data={movies}
                        renderItem={renderMovieItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.listContainer}
                        ListEmptyComponent={
                            <View style={styles.centerContainer}>
                                <Text style={styles.emptyText}>Nenhum filme encontrado</Text>
                            </View>
                        }
                    />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    searchContainer: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    searchInput: {
        flex: 1,
        height: 44,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    searchButton: {
        marginLeft: 10,
        width: 44,
        height: 44,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchButtonText: {
        fontSize: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 15,
        paddingBottom: 10,
    },
    listContainer: {
        padding: 10,
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
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
});
