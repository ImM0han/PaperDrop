import * as FileSystem from 'expo-file-system/legacy';
import * as SQLite from "expo-sqlite";
import * as DocumentPicker from "expo-document-picker";
import { APP_LIBRARY_DIR } from "../utils/constants";

let db;

export async function initDocumentDb() {
  if (!db) db = await SQLite.openDatabaseAsync("paperdrop.db");
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY NOT NULL,
      filename TEXT NOT NULL,
      fileType TEXT NOT NULL,
      originalUri TEXT,
      localUri TEXT NOT NULL,
      fileSize INTEGER,
      pageCount INTEGER,
      uploadedAt INTEGER,
      lastModified INTEGER,
      lastOpened INTEGER,
      lastEditedAt INTEGER,
      hasTextLayer INTEGER DEFAULT 1,
      isEditLocked INTEGER DEFAULT 0,
      isFavorite INTEGER DEFAULT 0,
      currentVersion INTEGER DEFAULT 1
    );
  `);

  await ensureLibraryDir();
}

export async function ensureLibraryDir() {
  const dir = FileSystem.documentDirectory + APP_LIBRARY_DIR;
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
  return dir;
}

function extToType(name) {
  const lower = (name || "").toLowerCase();
  if (lower.endsWith(".pdf")) return "pdf";
  if (lower.endsWith(".docx")) return "docx";
  if (lower.endsWith(".pptx")) return "pptx";
  return "file";
}

export async function pickAndImportDocument() {
  await initDocumentDb();
  const result = await DocumentPicker.getDocumentAsync({
    type: ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
    copyToCacheDirectory: true,
    multiple: false,
  });

  if (result.canceled) return null;

  const asset = result.assets?.[0];
  if (!asset?.uri) return null;

  const filename = asset.name || `file_${Date.now()}`;
  const fileType = extToType(filename);
  const libraryDir = await ensureLibraryDir();

  const id = `doc_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const localUri = `${libraryDir}/${id}_${filename}`;

  await FileSystem.copyAsync({ from: asset.uri, to: localUri });

  const info = await FileSystem.getInfoAsync(localUri);

  await db.runAsync(
    `INSERT INTO documents
      (id, filename, fileType, originalUri, localUri, fileSize, uploadedAt, lastModified, lastOpened, lastEditedAt, currentVersion)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      filename,
      fileType,
      asset.uri,
      localUri,
      info.size || 0,
      Date.now(),
      Date.now(),
      Date.now(),
      0,
      1,
    ]
  );

  return id;
}

export async function listDocuments() {
  await initDocumentDb();
  const rows = await db.getAllAsync(`SELECT * FROM documents ORDER BY uploadedAt DESC`);
  return rows;
}

export async function getDocumentById(id) {
  await initDocumentDb();
  const row = await db.getFirstAsync(`SELECT * FROM documents WHERE id = ?`, [id]);
  return row;
}

export async function touchOpened(id) {
  await initDocumentDb();
  await db.runAsync(`UPDATE documents SET lastOpened = ? WHERE id = ?`, [Date.now(), id]);
}

export async function updateEdited(id) {
  await initDocumentDb();
  await db.runAsync(`UPDATE documents SET lastEditedAt = ? WHERE id = ?`, [Date.now(), id]);
}

export async function replaceDocumentFile(id, newLocalUri) {
  await initDocumentDb();
  await db.runAsync(
    `UPDATE documents SET localUri = ?, lastModified = ?, currentVersion = currentVersion + 1, lastEditedAt = ? WHERE id = ?`,
    [newLocalUri, Date.now(), Date.now(), id]
  );
}