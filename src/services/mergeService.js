import * as FileSystem from "expo-file-system";
import { PDFDocument } from "pdf-lib";
import { ensureLibraryDir, initDocumentDb } from "./documentService";
import * as SQLite from "expo-sqlite";

let db;
async function getDb() {
  if (!db) db = await SQLite.openDatabaseAsync("paperdrop.db");
  await initDocumentDb();
  return db;
}

export async function mergePdfs(docs) {
  const merged = await PDFDocument.create();

  for (const d of docs) {
    const b64 = await FileSystem.readAsStringAsync(d.localUri, { encoding: FileSystem.EncodingType.Base64 });
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const pdf = await PDFDocument.load(bytes);
    const copied = await merged.copyPages(pdf, pdf.getPageIndices());
    copied.forEach((p) => merged.addPage(p));
  }

  const out = await merged.save();
  const outB64 = Buffer.from(out).toString("base64");
  const libraryDir = await ensureLibraryDir();

  const id = `doc_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const filename = `Merged_${Date.now()}.pdf`;
  const localUri = `${libraryDir}/${id}_${filename}`;

  await FileSystem.writeAsStringAsync(localUri, outB64, { encoding: FileSystem.EncodingType.Base64 });
  const info = await FileSystem.getInfoAsync(localUri);

  const db = await getDb();
  await db.runAsync(
    `INSERT INTO documents (id, filename, fileType, localUri, fileSize, uploadedAt, lastModified, lastOpened, lastEditedAt, currentVersion)
     VALUES (?, ?, 'pdf', ?, ?, ?, ?, ?, ?, 1)`,
    [id, filename, localUri, info.size || 0, Date.now(), Date.now(), Date.now(), Date.now()]
  );

  return id;
}