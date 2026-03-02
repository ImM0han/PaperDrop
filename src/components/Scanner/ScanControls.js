import React from "react";
import { View, Pressable, Text } from "react-native";
import { tokens } from "../../styles/tokens";

export default function ScanControls({ onFlash, onCapture, onOcr }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-around", paddingBottom: 10 }}>
      <Pressable onPress={onFlash} style={{ padding: 10 }}>
        <Text style={{ color: "white", fontWeight: "900" }}>Flash</Text>
      </Pressable>
      <Pressable onPress={onCapture} style={{ padding: 10 }}>
        <Text style={{ color: "white", fontWeight: "900" }}>Capture</Text>
      </Pressable>
      <Pressable onPress={onOcr} style={{ padding: 10 }}>
        <Text style={{ color: tokens.mint, fontWeight: "900" }}>OCR</Text>
      </Pressable>
    </View>
  );
}