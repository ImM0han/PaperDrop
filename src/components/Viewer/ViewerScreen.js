import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import { useAppStore } from "../../store/appStore";
import { tokens } from "../../styles/tokens";
import ViewerHeader from './ViewerHeader';
import PDFCanvas from './PDFCanvas';
import AnnotationToolbar from './AnnotationToolbar';
import PageNavBar from './PageNavBar';
import { getDocumentById, touchOpened } from "../../services/documentService";
import { useTextEditStore } from "../../store/textEditStore";
import EditModeOverlay from "./TextEdit/EditModeOverlay";
import TextEditToolbar from "./TextEdit/TextEditToolbar";
import FindReplaceBar from "./TextEdit/FindReplaceBar";
import { applyPdfTextEdits } from "../../services/textEditService";

export default function ViewerScreen() {
  const docId = useAppStore((s) => s.currentDocId);
  const closeDoc = useAppStore((s) => s.closeDoc);
  const isEditing = useTextEditStore((s) => s.isEditing);
  const setIsEditing = useTextEditStore((s) => s.setIsEditing);
  const [doc, setDoc] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFind, setShowFind] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Fixed: useCallback instead of inline function to prevent re-renders
  const handlePageSize = useCallback((pageNumber, size) => {
    useTextEditStore.getState().setPageSize(docId, pageNumber, size);
  }, [docId]);

  const handleDirty = useCallback(() => setDirty(true), []);

  useEffect(() => {
    (async () => {
      if (!docId) return;
      const d = await getDocumentById(docId);
      setDoc(d);
      setCurrentPage(1);
      setDirty(false);
      await touchOpened(docId);
    })().catch(() => {});
  }, [docId]);

  if (!docId || !doc) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: tokens.muted, fontWeight: "800" }}>Open a file from Home</Text>
      </View>
    );
  }

  async function onToggleEdit() {
    if (!isEditing) {
      setIsEditing(true);
      setShowFind(false);
      return;
    }
    try {
      //Fixed: read directly from store, not from useMemo
      const blocksByDoc = useTextEditStore.getState().blocksByDoc;
      const allBlocks = blocksByDoc[docId] || {};
      const edited = Object.values(allBlocks).flat();
      if (edited.length === 0) { setIsEditing(false); return; }
      if (doc.fileType !== "pdf") {
        Alert.alert("Not supported yet", "DOCX/PPTX editing coming soon.");
        setIsEditing(false);
        return;
      }
      const newUri = await applyPdfTextEdits(doc.localUri, docId, edited);
      setDirty(false);
      setIsEditing(false);
      const refreshed = await getDocumentById(docId);
      setDoc(refreshed);
    } catch (e) {
      Alert.alert("Save failed", "Could not write edits into this PDF.");
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#E8E4DC" }}>
      <ViewerHeader
        filename={doc.filename}
        dirty={dirty}
        isEditing={isEditing}
        onBack={() => { setIsEditing(false); closeDoc(); }}
        onToggleEdit={onToggleEdit}
        onFind={() => setShowFind((v) => !v)}
      />

      {showFind && isEditing ? (
        <FindReplaceBar docId={docId} onDirty={handleDirty} />
      ) : null}

      <View style={{ flex: 1 }}>
        <PDFCanvas
          key={doc.localUri}
          localUri={doc.localUri}
          onPageCount={setPageCount}
          onPageSize={handlePageSize}
        />
        {isEditing ? (
          <EditModeOverlay docId={docId} currentPage={currentPage} onDirty={handleDirty} />
        ) : null}
      </View>

      {!isEditing ? <AnnotationToolbar /> : null}

      <PageNavBar
        page={currentPage}
        pageCount={pageCount}
        onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
        onNext={() => setCurrentPage((p) => Math.min(pageCount || 1, p + 1))}
      />

      {isEditing ? (
        <TextEditToolbar docId={docId} currentPage={currentPage} onDirty={handleDirty} />
      ) : null}
    </View>
  );
}