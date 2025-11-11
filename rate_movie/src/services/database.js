import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabase("movies.db");

export const initDB = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(

        'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY NOT NULL, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL);',
        [],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};
export default db;