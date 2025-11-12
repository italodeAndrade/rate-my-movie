// src/services/profileService.js
import { getDB } from './database';

/**
 * Busca todas as informações (incluindo o caminho da foto) de um usuário.
 * @param {number} userId - O ID do usuário logado.
 * @returns {Promise<object|null>} Objeto completo do usuário.
 */
export const getUserProfile = async (userId) => {
    const db = getDB();
    // ⚠️ Atenção: A coluna 'name' deve ser incluída aqui, se existir no seu DB.
    const query = 'SELECT id, email, name, photo_path FROM users WHERE id = ?';
    
    try {
        const user = await db.getFirstAsync(query, [userId]);
        
        // Se o usuário existir, mas a foto_path for null, define como null.
        return user || null; 
        
    } catch (error) {
        console.error("Erro ao buscar perfil do usuário:", error);
        throw new Error("Não foi possível carregar o perfil.");
    }
};