import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { tokens } from "../../styles/tokens";
import FileTypeBadge from "../Common/FileTypeBadge";

function colorForType(type) {
  if (type === "pdf") return tokens.coral;
  if (type === "docx") return tokens.sky;
  if (type === "pptx") return tokens.yellow;
  return tokens.muted;
}

export default function FileList({ docs, onOpen, onEdit }) {
  if (!docs || docs.length === 0) {
    return (
      <View style={{ padding: 20, alignItems: "center" }}>
        <Text style={{ color: tokens.muted, fontWeight: "700" }}>No files yet. Import one below.</Text>
      </View>
    );
  }

  return (
    <View>
      {docs.map((d) => (
        <Pressable
          key={d.id}
          onPress={() => onOpen(d.id)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 12,
            backgroundColor: tokens.card,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: tokens.border,
            marginBottom: 10,
          }}
        >
          <View style={{
            width: 44, height: 44, borderRadius: 12,
            backgroundColor: colorForType(d.fileType) + "22",
            alignItems: "center", justifyContent: "center", marginRight: 12,
          }}>
            <Text style={{ fontSize: 11, fontWeight: "900", color: colorForType(d.fileType) }}>
              {(d.fileType || "FILE").toUpperCase()}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={{ fontWeight: "900", color: tokens.text }}>
              {d.filename}
            </Text>
            <Text style={{ marginTop: 3, fontWeight: "700", color: tokens.muted, fontSize: 11 }}>
             {(d.fileType || "").toUpperCase()} {" · "} {((d.fileSize || 0) / 1024).toFixed(0)} KB
            </Text>
          </View>

          <Pressable
            onPress={(e) => { e.stopPropagation(); onEdit?.(d.id); }}
            style={{
              paddingVertical: 6, paddingHorizontal: 10,
              borderRadius: 9999, backgroundColor: "#FFF0FA", marginRight: 8,
            }}
          >
            <Text style={{ fontWeight: "900", color: tokens.pink, fontSize: 12 }}>Edit</Text>
          </Pressable>

          <Text style={{ fontSize: 16, color: tokens.muted }}>{">"}</Text>
        </Pressable>
      ))}
    </View>
  );
}