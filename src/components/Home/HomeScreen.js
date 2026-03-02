import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { tokens } from "../../styles/tokens";
import QuickChips from "./QuickChips";
import RecentCarousel from "./RecentCarousel";
import FileList from "./FileList";
import FAB from "./FAB";
import { listDocuments, pickAndImportDocument } from "../../services/documentService";
import { useAppStore } from "../../store/appStore";

function Logo() {
  const letters = [
    ["P", tokens.coral], ["a", tokens.sky], ["p", tokens.yellow], ["e", tokens.mint], ["r", tokens.coral],
    ["D", tokens.violet], ["r", tokens.pink], ["o", tokens.sky], ["p", tokens.mint],
  ];
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {letters.map(([ch, color], i) => (
        <Text key={i} style={{ fontSize: 26, fontWeight: "900", color }}>{ch}</Text>
      ))}
    </View>
  );
}

export default function HomeScreen() {
  const [docs, setDocs] = useState([]);
  const openDoc = useAppStore((s) => s.openDoc);

  async function refresh() {
    const rows = await listDocuments();
    setDocs(rows || []);
  }

  useEffect(() => {
    refresh().catch(() => {});
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 140 }}>
        {/* Header */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Logo />
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 999,
              backgroundColor: tokens.violet,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "900" }}>PD</Text>
          </View>
        </View>

        <View style={{ height: 14 }} />

        <QuickChips
          onScan={() => {}}
          onView={() => {}}
          onMerge={() => {}}
          onEditText={() => {}}
          onExport={() => {}}
        />

        <View style={{ height: 18 }} />

        <RecentCarousel docs={docs.slice(0, 10)} onOpen={(id) => openDoc(id)} />

        <View style={{ height: 18 }} />

        <Text style={{ fontSize: 16, fontWeight: "900", color: tokens.text, marginBottom: 10 }}>
          All Files
        </Text>

        <FileList docs={docs} onOpen={(id) => openDoc(id)} onEdit={(id) => openDoc(id)} />

        <View style={{ height: 22 }} />

        <Pressable
          onPress={async () => {
            const id = await pickAndImportDocument();
            if (id) {
              await refresh();
              openDoc(id);
            }
          }}
          style={{
            backgroundColor: tokens.card,
            borderRadius: tokens.radiusLg,
            padding: 14,
            borderWidth: 1,
            borderColor: tokens.border,
          }}
        >
          <Text style={{ fontWeight: "900", color: tokens.text }}>Import a document</Text>
          <Text style={{ marginTop: 4, color: tokens.muted, fontWeight: "600" }}>
            PDF / DOCX / PPTX (stored locally, offline)
          </Text>
        </Pressable>
      </ScrollView>

      <FAB
        onUpload={async () => {
          const id = await pickAndImportDocument();
          if (id) {
            await refresh();
            openDoc(id);
          }
        }}
        onScan={() => {}}
      />
    </View>
  );
}