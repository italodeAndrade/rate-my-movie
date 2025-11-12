import * as SQLite from 'expo-sqlite';

let db = null;
export async function initDB() {
    try {
        db = await SQLite.openDatabaseAsync("movies.db");

        await db.runAsync(
            'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY NOT NULL, email TEXT NOT NULL UNIQUE, nome TEXT NOT NULL, password TEXT NOT NULL, photo_path TEXT);'
        );
        console.log("Banco de dados 'movies.db' inicializado e tabela criada.");
        
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