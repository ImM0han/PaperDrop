import React from "react";
import { View, Text } from "react-native";
import { tokens } from "../../styles/tokens";

export default function FileTypeBadge({ type }) {
  let bg = "#FFE8E8";
  let color = tokens.coral;
  if (type === "docx") { bg = "#E0F7F6"; color = tokens.sky; }
  if (type === "pptx") { bg = "#FFF6C7"; color = "#B7791F"; }

  return (
    <View style={{ paddingVertical: 4, paddingHorizontal: 8, borderRadius: 999, backgroundColor: bg }}>
      <Text style={{ fontSize: 10, fontWeight: "900", color }}>{(type || "").toUpperCase()}</Text>
    </View>
  );
}