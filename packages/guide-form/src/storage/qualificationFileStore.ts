import { loadOrCreateAnonymousDraft } from "./anonymousDraftStorage";

const DB_NAME = "yaotu-guide-application";
const DB_VERSION = 1;
const STORE_NAME = "qualificationFiles";

export interface StagedQualificationFile {
  fileId: string;
  clientDraftId: string;
  name: string;
  type: string;
  size: number;
  description: string;
  visible: boolean;
  createdAt: string;
  uploaded?: boolean;
  publicUrl?: string;
  serverFileId?: string;
  uploadedMetadata?: StagedQualificationUploadedMetadata;
}

export interface StagedQualificationUploadedMetadata {
  fileId?: string;
  r2Key?: string;
  publicUrl?: string;
  originalName?: string;
  size?: number;
  mimetype?: string;
}

interface StagedQualificationFileRecord extends StagedQualificationFile {
  blob: Blob;
}

const canUseIndexedDb = () =>
  typeof window !== "undefined" && typeof window.indexedDB !== "undefined";

const makeFileId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `file_${Date.now()}_${Math.random().toString(36).slice(2)}`;
};

const openDb = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    if (!canUseIndexedDb()) {
      reject(new Error("IndexedDB is not available in this browser"));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "fileId" });
        store.createIndex("clientDraftId", "clientDraftId", { unique: false });
      }
    };

    request.onerror = () => reject(request.error ?? new Error("Failed to open IndexedDB"));
    request.onsuccess = () => resolve(request.result);
  });

const withStore = async <T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T> | void
): Promise<T | undefined> => {
  const db = await openDb();
  return new Promise<T | undefined>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const request = operation(store);

    transaction.oncomplete = () => {
      db.close();
      resolve(request ? request.result : undefined);
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error ?? new Error("IndexedDB transaction failed"));
    };
    transaction.onabort = () => {
      db.close();
      reject(transaction.error ?? new Error("IndexedDB transaction aborted"));
    };
  });
};

const toMetadata = (record: StagedQualificationFileRecord): StagedQualificationFile => {
  const { blob: _blob, ...metadata } = record;
  return metadata;
};

export const stageQualificationFile = async (
  file: File,
  description: string,
  options: { clientDraftId?: string; visible?: boolean } = {}
): Promise<StagedQualificationFile> => {
  const clientDraftId = options.clientDraftId ?? loadOrCreateAnonymousDraft().clientDraftId;
  const record: StagedQualificationFileRecord = {
    fileId: makeFileId(),
    clientDraftId,
    name: file.name,
    type: file.type,
    size: file.size,
    description,
    visible: options.visible ?? true,
    createdAt: new Date().toISOString(),
    blob: file,
  };

  await withStore("readwrite", (store) => store.put(record));
  return toMetadata(record);
};

export const listStagedQualificationFiles = async (
  clientDraftId: string
): Promise<StagedQualificationFile[]> => {
  const records = await withStore<StagedQualificationFileRecord[]>("readonly", (store) => {
    const index = store.index("clientDraftId");
    return index.getAll(clientDraftId);
  });
  return (records ?? []).map(toMetadata);
};

export const getStagedQualificationFile = async (
  fileId: string
): Promise<(StagedQualificationFile & { blob: Blob }) | null> => {
  const record = await withStore<StagedQualificationFileRecord>("readonly", (store) =>
    store.get(fileId)
  );
  return record ?? null;
};

export const removeStagedQualificationFile = async (fileId: string): Promise<void> => {
  await withStore("readwrite", (store) => {
    store.delete(fileId);
  });
};

export const clearStagedQualificationFiles = async (clientDraftId: string): Promise<void> => {
  const files = await listStagedQualificationFiles(clientDraftId);
  await Promise.all(files.map((file) => removeStagedQualificationFile(file.fileId)));
};

export const markStagedQualificationFileUploaded = async (
  fileId: string,
  data: StagedQualificationUploadedMetadata
): Promise<StagedQualificationFile | null> => {
  const record = await getStagedQualificationFile(fileId);
  if (!record) return null;

  const next: StagedQualificationFileRecord = {
    ...record,
    uploaded: true,
    publicUrl: data.publicUrl,
    serverFileId: data.fileId,
    uploadedMetadata: data,
  };

  await withStore("readwrite", (store) => store.put(next));
  return toMetadata(next);
};

export const indexedDbQualificationStorageAvailable = canUseIndexedDb;
