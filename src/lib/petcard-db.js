import { openDB } from 'idb';

const DB_NAME = 'pet-disaster-app';
const DB_VERSION = 1;

const getDB = () =>
  openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('petcard')) {
        db.createObjectStore('petcard');
      }
      if (!db.objectStoreNames.contains('quizResults')) {
        db.createObjectStore('quizResults', { autoIncrement: true });
      }
    },
  });

export const savePetCard = async (data) => {
  const db = await getDB();
  return db.put('petcard', data, 'current');
};

export const loadPetCard = async () => {
  const db = await getDB();
  return db.get('petcard', 'current');
};

export const saveQuizResult = async (result) => {
  const db = await getDB();
  return db.add('quizResults', { ...result, savedAt: new Date().toISOString() });
};

export const loadQuizResults = async () => {
  const db = await getDB();
  return db.getAll('quizResults');
};
