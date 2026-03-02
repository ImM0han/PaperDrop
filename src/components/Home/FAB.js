import React, { useState } from "react";
import { View, Pressable, Text } from "react-native";
import { tokens } from "../../styles/tokens";

export default function FAB({ onUpload, onScan }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ position: "absolute", right: 16, bottom: 96 }}>
      {open ? (
        <View style={{ marginBottom: 10, alignItems: "flex-end" }}>
          <Pressable onPress={() => { setOpen(false); onUpload?.(); }}
            style={{ backgroundColor: tokens.card, padding: 12, borderRadius: 16, marginBottom: 8, borderWidth: 1, borderColor: tokens.border }}>
            <Text style={{ fontWeight: "900", color: tokens.text }}>Upload</Text>
          </Pressable>
          <Pressable onPress={() => { setOpen(false); onScan?.(); }}
            style={{ backgroundColor: tokens.card, padding: 12, borderRadius: 16, borderWidth: 1, borderColor: tokens.border }}>
            <Text style={{ fontWeight: "900", color: tokens.text }}>Scan</Text>
          </Pressable>
        </View>
      ) : null}
      <Pressable onPress={() => setOpen((v) => !v)}
        style={{ width: 56, height: 56, borderRadius: 999, backgroundColor: tokens.coral, alignItems: "center", justifyContent: "center", elevation: 6 }}>
        <Text style={{ fontSize: 28, color: "white", fontWeight: "900" }}>+</Text>
      </Pressable>
    </View>
  );
}