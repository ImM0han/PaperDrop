import * as FileSystem from "expo-file-system/legacy";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { ensureLibraryDir } from "./documentService";

export async function applyPdfTextEdits(localUri, docId, blocksFlat) {
  const b64 = await FileSystem.readAsStringAsync(localUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // ✅ No Buffer — use atob directly
  const pdfBytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  blocksFlat.forEach((b) => {
    if (!b?.pageNumber) return;
    const page = pdfDoc.getPage(Math.max(0, b.pageNumber - 1));
    if (!page) return;

    const { height } = page.getSize();
    const x = Math.max(0, b.position.x);
    const y = Math.max(0, height - b.position.y - b.position.height);
    const fontSize = b.style?.fontSize || 14;
    const hex = (b.style?.color || "#2D2D2D").replace("#", "");
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const bl = parseInt(hex.slice(4, 6), 16) / 255;

    page.drawRectangle({
      x, y,
      width: Math.max(1, b.position.width),
      height: Math.max(1, b.position.height),
      color: rgb(1, 1, 1),
    });

    page.drawText(b.content || "", {
      x: x + 2,
      y: y + 4,
      size: fontSize,
      font,
      color: rgb(
        isFinite(r) ? r : 0.18,
        isFinite(g) ? g : 0.18,
        isFinite(bl) ? bl : 0.18
      ),
      maxWidth: Math.max(10, b.position.width - 4),
    });
  });

  // ✅ No Buffer — convert Uint8Array to base64 manually
  const out = await pdfDoc.save();
  let binary = "";
  out.forEach((byte) => { binary += String.fromCharCode(byte); });
  const outB64 = btoa(binary);

  const libraryDir = await ensureLibraryDir();
  const newUri = `${libraryDir}/${docId}_edited_${Date.now()}.pdf`;
  await FileSystem.writeAsStringAsync(newUri, outB64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return newUri;
}