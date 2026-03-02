import React, { useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { tokens } from "../../styles/tokens";
import CameraFrame from "./CameraFrame";
import ScanControls from "./ScanControls";
import ScannedStrip from "./ScannedStrip";
import ScanActions from "./ScanActions";
import { imagesToPdf } from "../../services/scanService";
import { useAppStore } from "../../store/appStore";

export default function ScannerScreen() {
  const [shots, setShots] = useState([]); // [{ uri }]
  const openDoc = useAppStore((s) => s.openDoc);

  return (
    <View style={{ flex: 1, backgroundColor: "#111" }}>
      <View style={{ padding: 16 }}>
        <Text style={{ color: "white", fontSize: 20, fontWeight: "900" }}>Scanner</Text>
        <Text style={{ color: "#bbb", marginTop: 6, fontWeight: "700" }}>
          Capture pages, save offline as PDF.
        </Text>
      </View>

      <CameraFrame onCapture={(uri) => setShots((s) => [...s, { uri }])} />

      <ScanControls
        onFlash={() => {}}
        onCapture={() => {}}
        onOcr={() => Alert.alert("OCR", "Offline OCR in Expo Go is limited. We can enable advanced OCR with a Dev Client build.")}
      />

      <ScannedStrip shots={shots} />

      <ScanActions
        onRetake={() => setShots([])}
        onSave={async () => {
          try {
            if (shots.length === 0) return Alert.alert("No pages", "Capture at least one page.");
            const newId = await imagesToPdf(shots.map((s) => s.uri));
            Alert.alert("Saved", "Opening scanned PDF...");
            openDoc(newId);
          } catch {
            Alert.alert("Failed", "Could not create PDF.");
          }
        }}
        onEditSave={async () => {
          try {
            if (shots.length === 0) return Alert.alert("No pages", "Capture at least one page.");
            const newId = await imagesToPdf(shots.map((s) => s.uri));
            openDoc(newId);
          } catch {
            Alert.alert("Failed", "Could not create PDF.");
          }
        }}
      />
    </View>
  );
}