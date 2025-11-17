import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDB } from './database';

const USER_KEY = '@UserId';

/**
 * Realiza login do usuário
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object|null>}
 */
export const signIn = async (email, password) => {
  const db = getDB();
  const query = 'SELECT id, email, name FROM users WHERE email = ? AND password = ?';
  
  try {
    const user = await db.getFirstAsync(query, [email, password]);
    
    if (user) {
      await AsyncStorage.setItem(USER_KEY, user.id.toString()); 
      return user;
    }
    return null;

  } catch (error) {
    throw new Error("Ocorreu um erro durante a autenticação.");
  }
};

/**
 * Registra novo usuário
 * @param {string} email
 * @param {string} name
 * @param {string} password
 * @returns {Promise<object>}
 */
export const register = async (email, name, password) => {
  const db = getDB();
  const query = 'INSERT INTO users (email, name, password) VALUES (?,?,?)';

  try {
    const result = await db.runAsync(query, [email, name, password]);
    const userId = result.lastInsertRowId;
    
    await AsyncStorage.setItem(USER_KEY, userId.toString());
    return { id: userId, email, name };
    
  } catch (error) {
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      throw new Error("Este email já está cadastrado.");
    }
    throw new Error("Erro desconhecido ao cadastrar.");
  }
};

/**
 * Busca perfil completo do usuário
 * @param {number} userId
 * @returns {Promise<object|null>}
 */
export const getUserProfile = async (userId) => {
  const db = getDB();
  const query = 'SELECT id, email, name, photo_path FROM users WHERE id = ?';
  
  try {
    const user = await db.getFirstAsync(query, [userId]);
    return user || null;
    
  } catch (error) {
    throw new Error("Não foi possível carregar o perfil.");
  }
};

/**
 * Retorna ID do usuário logado
 * @returns {Promise<number|null>}
 */
export const getLoggedInUserId = async () => {
  const userId = await AsyncStorage.getItem(USER_KEY);
  return userId ? parseInt(userId) : null;
};

/**
 * Realiza logout do usuário
 */
export const signOut = async () => {
  await AsyncStorage.removeItem(USER_KEY);
};