import React from "react";
import { View, Text, Pressable } from "react-native";
import { tokens } from "../../styles/tokens";

export default function PageNavBar({ page, pageCount, onPrev, onNext }) {
  return (
    <View style={{
      backgroundColor: tokens.card,
      borderTopWidth: 1, borderTopColor: tokens.border,
      paddingVertical: 10,
    }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        <Pressable onPress={onPrev} style={{ padding: 10, marginRight: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "800", color: tokens.text }}>{"<"}</Text>
        </Pressable>
        <Text style={{ fontWeight: "900", color: tokens.text }}>
          Page {page} of {pageCount || "-"}
        </Text>
        <Pressable onPress={onNext} style={{ padding: 10, marginLeft: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "800", color: tokens.text }}>{">"}</Text>
        </Pressable>
      </View>
    </View>
  );
}