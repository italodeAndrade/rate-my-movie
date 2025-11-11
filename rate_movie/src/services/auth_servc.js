import AsyncStorage from '@react-native-async-storage/async-storage';
import { register as reg, login as userLogin } from './user_op'; 

const USER_KEY = '@UserId';

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object|null>}
 */
export const signIn = async (email, password) => {
  try {
    const user = await userLogin(email, password);
    if (user) {
      await AsyncStorage.setItem(USER_KEY, user.id.toString()); 
      return user;
    }
    return null; 

  } catch (error) {
    console.error("Erro no signIn:", error);
    throw new Error("Ocorreu um erro durante a autenticação.");
  }
};

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>}
 */
export const register = async (email, password) => {
  try {
    const userId = await reg(email, password);
    await AsyncStorage.setItem(USER_KEY, userId.toString());
    return { id: userId, email };
  } catch (error) {
    console.log("Erro no registro:", error);
    throw error;
  }
};

/**
 * @returns {Promise<number|null>}
 */
export const getLoggedInUserId = async () => {
  const userId = await AsyncStorage.getItem(USER_KEY);
  return userId ? parseInt(userId) : null;
};


export const signOut = async () => {
  await AsyncStorage.removeItem(USER_KEY);
};