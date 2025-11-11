// src/services/user_op.js
import { getDB } from './database';

/**
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<number>}
 */
export const register = async (email, password) => {
    const db = getDB();
    const query = 'INSERT INTO users (email, password) VALUES (?, ?)';

    try {
        const result = await db.runAsync(query, [email, password]);
        return result.lastInsertRowId;
        
    } catch (error) {
        if (error.message && error.message.includes('UNIQUE constraint failed')) {
            throw new Error("Este email já está cadastrado.");
        } else {
            console.error("Erro no registro SQL:", error);
            throw new Error("Erro desconhecido ao cadastrar.");
        }
    }
};

/**
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<object|null>} 
 */
export const login = async (email, password) => {
    const db = getDB();
    const query = 'SELECT id, email FROM users WHERE email = ? AND password = ?';
    
    try {

        const user = await db.getFirstAsync(query, [email, password]);
        
        return user || null; 
        
    } catch (error) {
        console.error("Erro na consulta de login:", error);
        throw new Error("Erro interno ao buscar usuário.");
    }
};