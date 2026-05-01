const DB_NAME = 'ascii-studio';
const STORE = 'creations';
const VERSION = 1;

export interface SavedCreation {
  id: string;
  name: string;
  templateId: string;
  texts: Record<string, string>;
  sourceDataUrl?: string;
  thumbnail: string;
  ratio: string;
  createdAt: number;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt');
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T> | Promise<T>,
): Promise<T> {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const store = tx.objectStore(STORE);
    const out = fn(store);
    if (out instanceof Promise) {
      out.then(resolve, reject);
      tx.oncomplete = () => db.close();
      return;
    }
    out.onsuccess = () => resolve(out.result);
    out.onerror = () => reject(out.error);
    tx.oncomplete = () => db.close();
  });
}

export async function listCreations(): Promise<SavedCreation[]> {
  return withStore<SavedCreation[]>('readonly', (store) => {
    const req = store.getAll();
    return req as IDBRequest<SavedCreation[]>;
  }).then((rows) => rows.sort((a, b) => b.createdAt - a.createdAt));
}

export async function saveCreation(item: SavedCreation): Promise<void> {
  await withStore('readwrite', (store) => store.put(item) as IDBRequest<IDBValidKey>);
}

export async function deleteCreation(id: string): Promise<void> {
  await withStore('readwrite', (store) => store.delete(id) as IDBRequest<undefined>);
}

export function makeId(): string {
  return `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
