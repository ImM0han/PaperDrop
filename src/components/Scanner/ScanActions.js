import * as FileSystem from "expo-file-system";
import { PDFDocument } from "pdf-lib";
import { ensureLibraryDir, initDocumentDb } from "../../services/documentService";
import * as SQLite from "expo-sqlite";

let db;
async function getDb() {
  if (!db) db = await SQLite.openDatabaseAsync("paperdrop.db");
  await initDocumentDb();
  return db;
}

export async function imagesToPdf(imageUris) {
  const pdf = await PDFDocument.create();

  for (const uri of imageUris) {
    const b64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    // assume jpg/png; try both
    let img;
    try { img = await pdf.embedJpg(bytes); } catch { img = await pdf.embedPng(bytes); }

    const page = pdf.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  }

  const out = await pdf.save();
  const outB64 = Buffer.from(out).toString("base64");

  const libraryDir = await ensureLibraryDir();
  const id = `doc_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const filename = `Scan_${Date.now()}.pdf`;
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