
import * as FileSystem from 'expo-file-system/legacy';
import { getDB } from './database';

const PROFILE_PHOTOS_DIR = FileSystem.documentDirectory + 'profile_photos/';

const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(PROFILE_PHOTOS_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(PROFILE_PHOTOS_DIR, { intermediates: true });
  }
};


/**
 * Salva o arquivo da foto localmente e atualiza o caminho no banco de dados.
 * @param {number} userId - O ID do usuário.
 * @param {string} localUri - O URI temporário da imagem selecionada.
 * @returns {Promise<string>} O URI permanente da imagem.
 */
export const saveProfilePhoto = async (userId, localUri) => {
  await ensureDirExists();

  // Cria o nome do arquivo usando o ID do usuário (photo_[ID].jpg)
  const filename = `photo_${userId}.jpg`;
  const newPath = PROFILE_PHOTOS_DIR + filename;
  
  try {
    await FileSystem.copyAsync({
      from: localUri,
      to: newPath,
    });
    
    const db = getDB();
    const photoUri = newPath;
    
    const query = 'UPDATE users SET photo_path = ? WHERE id = ?;';
    await db.runAsync(query, [photoUri, userId]);
    
    return photoUri;
    
  } catch (error) {
    throw new Error("Falha ao processar e salvar a imagem.");
  }
};