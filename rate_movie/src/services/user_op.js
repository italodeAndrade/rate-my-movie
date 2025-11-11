
import db from './database'; 

/**
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<number>} 
 */
export const register = (email, password) => {
  const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
  
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        query,
        [email, password],
        (_, result) => resolve(result.insertId),
        (_, error) => {
          if (error.code === 6 && error.message.includes('UNIQUE constraint')) {
             reject(new Error("Este email já está cadastrado."));
          } else {
             reject(error);
          }
        }
      );
    });
  });
};

/**
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<object|null>} 
 */
export const login = (email, password) => {
  const query = 'SELECT id, email FROM users WHERE email = ? AND password = ?;';
  
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(query,[email, password],(_, result) => {
          if (result.rows.length > 0) {
            resolve(result.rows.item(0));
          } 
          else {
            resolve(null); 
          }
        },
        (_, error) => reject(error)
      );
    });
  });
};