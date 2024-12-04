import { openDB, IDBPDatabase } from 'idb';
import { Message } from '../dtos/Message';

const DATABASE_NAME = 'Messages';
const STORE_NAME = 'messages';

let db: IDBPDatabase | null = null;

export const initDB = async () => {
  db = await openDB(DATABASE_NAME, 1, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'order' }); // `order` as the key
      }
    },
  });

  console.log('Database connection open.');
};

export const addMessage = async (message: Message) => {
    return db?.put(STORE_NAME, message);
};


export const getMessages = async (): Promise<Message[]> => {
    return (await db?.getAll(STORE_NAME)) || [];
};

export const clearMessages = async () => {
  return db?.clear(STORE_NAME);
};

export const closeDB = (): void => {
    if (db) {
        db.close();
        db = null;
        
        console.log('Database connection closed.');
    }
};
