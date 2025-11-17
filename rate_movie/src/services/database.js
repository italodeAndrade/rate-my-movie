import * as SQLite from 'expo-sqlite';

let db = null;
export async function initDB() {
    try {
        db = await SQLite.openDatabaseAsync("movies.db");

        // Tabela de usuários
        await db.runAsync(
            'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY NOT NULL, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL, password TEXT NOT NULL, photo_path TEXT);'
        );
        
        // Tabela de filmes assistidos
        await db.runAsync(
            `CREATE TABLE IF NOT EXISTS watched_movies (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                movie_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                poster_path TEXT,
                overview TEXT,
                release_date TEXT,
                rating REAL,
                user_rating REAL,
                watched_date TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                UNIQUE(user_id, movie_id)
            );`
        );
        
        console.log("Banco de dados 'movies.db' inicializado com todas as tabelas.");
        
        return db; 
        
    } catch (error) {
        console.error("ERRO CRÍTICO ao abrir/inicializar o DB:", error);
        throw error;
    }
}

export function getDB() {
    if (!db) {
        throw new Error("O banco de dados não foi inicializado. Chame initDB() primeiro.");
    }
    return db;
}