import React from "react";
import { ScrollView, View, Text, Pressable } from "react-native";
import { tokens } from "../../styles/tokens";
import FileTypeBadge from "../Common/FileTypeBadge";

function gradientForType(type) {
  if (type === "pdf") return [tokens.coral, tokens.pink];
  if (type === "docx") return [tokens.sky, tokens.violet];
  if (type === "pptx") return [tokens.yellow, tokens.coral];
  return [tokens.muted, tokens.border];
}

export default function RecentCarousel({ docs, onOpen }) {
  return (
    <View>
      <Text style={{ fontSize: 16, fontWeight: "900", color: tokens.text, marginBottom: 10 }}>
        Recent
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {docs.map((d) => {
          const [a, b] = gradientForType(d.fileType);
          return (
            <Pressable
              key={d.id}
              onPress={() => onOpen(d.id)}
              style={{
                width: 130,
                borderRadius: 18,
                overflow: "hidden",
                marginRight: 12,
                backgroundColor: tokens.card,
                borderWidth: 1,
                borderColor: tokens.border,
              }}
            >
              <View style={{ height: 100, backgroundColor: a, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 12, fontWeight: "900", color: "#9B9BAE" }}>DOC</Text>
                <View style={{ position: "absolute", top: 8, right: 8 }}>
                  <FileTypeBadge type={d.fileType} />
                </View>
              </View>
              <View style={{ padding: 10 }}>
                <Text numberOfLines={1} style={{ fontSize: 12, fontWeight: "900", color: tokens.text }}>
                  {d.filename}
                </Text>
                <Text style={{ marginTop: 4, fontSize: 10, fontWeight: "700", color: tokens.muted }}>
                  {(d.fileSize / 1024).toFixed(0)} KB
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}