// A minimal helper around IndexedDB to persist the game settings.
// This replaces the previous use of localStorage in the React app.
import { Settings } from "../../worker/helpers";

const DB_NAME = "inad_settings_db";
const DB_VERSION = 1;
const STORE_NAME = "settings";
const SETTINGS_KEY = "settings";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error);
    };

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
}

export async function getSettingsFromDB(): Promise<Settings | undefined> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(SETTINGS_KEY);
      req.onsuccess = () => {
        resolve(req.result as Settings | undefined);
      };
      req.onerror = () => {
        console.error("Failed to read settings from IndexedDB", req.error);
        resolve(undefined);
      };
    });
  } catch (err) {
    console.error("Unable to open IndexedDB", err);
    return undefined;
  }
}

export async function saveSettingsToDB(settings: Settings): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(settings, SETTINGS_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => {
        console.error("Failed to save settings to IndexedDB", req.error);
        reject(req.error);
      };
    });
  } catch (err) {
    console.error("Unable to save settings to IndexedDB", err);
  }
} 