import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { tokens } from "../../styles/tokens";
import { listDocuments } from "../../services/documentService";
import { mergePdfs } from "../../services/mergeService";
import { useAppStore } from "../../store/appStore";

export default function MergeScreen() {
  const [docs, setDocs] = useState([]);
  const [selected, setSelected] = useState([]);
  const openDoc = useAppStore((s) => s.openDoc);

  useEffect(() => {
    listDocuments().then((d) => setDocs(d || [])).catch(() => {});
  }, []);

  const pdfs = docs.filter((d) => d.fileType === "pdf");

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "900", color: tokens.text }}>Merge</Text>
      <Text style={{ marginTop: 6, color: tokens.muted, fontWeight: "700" }}>
        Select PDFs and merge into one file (offline).
      </Text>

      <View style={{ height: 14 }} />

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {pdfs.map((d) => {
          const on = selected.includes(d.id);
          return (
            <Pressable
              key={d.id}
              onPress={() => setSelected((s) => (on ? s.filter((x) => x !== d.id) : [...s, d.id]))}
              style={{
                padding: 12,
                borderRadius: 16,
                backgroundColor: tokens.card,
                borderWidth: 1,
                borderColor: on ? tokens.violet : tokens.border,
                marginBottom: 10,
              }}
            >
              <Text style={{ fontWeight: "900", color: tokens.text }}>{d.filename}</Text>
              <Text style={{ marginTop: 4, fontWeight: "700", color: on ? tokens.violet : tokens.muted }}>
                {on ? "Selected" : "Tap to select"}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={{ position: "absolute", left: 16, right: 16, bottom: 96 }}>
        <Pressable
          onPress={async () => {
            try {
              if (selected.length < 2) {
                Alert.alert("Select at least 2 PDFs");
                return;
              }
              const selectedDocs = pdfs.filter((d) => selected.includes(d.id));
              const outId = await mergePdfs(selectedDocs);
              Alert.alert("Merged!", "Opening merged PDF...");
              openDoc(outId);
            } catch (e) {
              Alert.alert("Merge failed", "Could not merge these PDFs.");
            }
          }}
          style={{
            backgroundColor: tokens.violet,
            paddingVertical: 14,
            borderRadius: tokens.radiusPill,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "900" }}>Merge into one PDF</Text>
        </Pressable>
      </View>
    </View>
  );
}