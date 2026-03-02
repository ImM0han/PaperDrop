import React from "react";
import { View, Text, Pressable } from "react-native";
import { tokens } from "../../styles/tokens";
import FileTypeBadge from "../Common/FileTypeBadge";

export default function ListItem({ doc, onOpen, onEdit }) {
  return (
    <Pressable onPress={onOpen}
      style={{ flexDirection: "row", alignItems: "center", padding: 12, backgroundColor: tokens.card, borderRadius: 16, borderWidth: 1, borderColor: tokens.border, marginBottom: 10 }}>
      <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: "#F5F3FF", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
        <Text style={{ fontSize: 20 }}>Doc</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={{ fontWeight: "900", color: tokens.text }}>{doc.filename}</Text>
        <Text style={{ marginTop: 3, fontWeight: "700", color: tokens.muted, fontSize: 11 }}>
          {doc.fileType.toUpperCase()} {" - "} {(doc.fileSize / 1024).toFixed(0)} KB
        </Text>
      </View>
      <Pressable onPress={(e) => { e.stopPropagation(); onEdit(); }}
        style={{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: 9999, backgroundColor: "#FFF0FA", marginRight: 10 }}>
        <Text style={{ fontWeight: "900", color: tokens.pink }}>Edit</Text>
      </Pressable>
      <Text style={{ fontSize: 18, color: tokens.muted }}>{">"}</Text>
    </Pressable>
  );
}