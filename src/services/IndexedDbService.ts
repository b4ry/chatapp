import { openDB, IDBPDatabase } from "idb";
import { Message } from "../dtos/Message";

const DATABASE_NAME = "ChatMessages";
const STORE_NAME = "ChatMessages";
const INDEX_NAME = "usernameIndex";

let db: IDBPDatabase | null = null;

export const initDB = async () => {
    db = await openDB(DATABASE_NAME, 5, {
        upgrade(database) {
            if (database.objectStoreNames.contains(STORE_NAME)) {
                database.deleteObjectStore(STORE_NAME);
            }
            const store = database.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            store.createIndex(INDEX_NAME, "username", { unique: false });
        },
    });

    console.log("Database connection open.");
};

export const addMessage = async (message: Message) => {
    return db?.add(STORE_NAME, message);
};

export const getMessages = async (): Promise<Message[]> => {
    return (await db?.getAll(STORE_NAME)) || [];
};
  
export const getMessagesByUsername = async (username: string): Promise<Message[]> => {
    const transaction = db?.transaction(STORE_NAME, "readonly");
    const store = transaction?.objectStore(STORE_NAME);
    const index = store?.index(INDEX_NAME);
    
    return (await index?.getAll(username)) || [];
};

export const closeDB = (): void => {
    if (db) {
        db.close();
        db = null;
        
        console.log("Database connection closed.");
    }
};
