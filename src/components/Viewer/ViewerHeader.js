import React from "react";
import { View, Text, Pressable } from "react-native";
import { tokens } from "../../styles/tokens";

export default function ViewerHeader({ filename, dirty, isEditing, onBack, onToggleEdit, onFind }) {
  return (
    <View style={{
      paddingHorizontal: 12, paddingTop: 10, paddingBottom: 10,
      backgroundColor: isEditing ? "#FFF5F5" : tokens.card,
      borderBottomWidth: 1, borderBottomColor: tokens.border,
      flexDirection: "row", alignItems: "center",
    }}>
      <Pressable onPress={onBack} style={{ padding: 8 }}>
        <Text style={{ fontSize: 18, fontWeight: "800", color: tokens.text }}>{"<"}</Text>
      </Pressable>

      <View style={{ flex: 1, paddingHorizontal: 6 }}>
        <Text numberOfLines={1} style={{ fontWeight: "900", color: tokens.text }}>
          {filename}{dirty ? " \u2022" : ""}
        </Text>
        {isEditing ? (
          <Text style={{ marginTop: 2, fontSize: 11, fontWeight: "800", color: tokens.coral }}>
            Editing
          </Text>
        ) : null}
      </View>

      <Pressable onPress={onFind} style={{ padding: 8 }}>
        <Text style={{ fontSize: 16 }}>Search</Text>
      </Pressable>

      <Pressable onPress={onToggleEdit} style={{
        paddingVertical: 8, paddingHorizontal: 12, borderRadius: 9999,
        backgroundColor: isEditing ? tokens.coral : "#F5F3FF",
      }}>
        <Text style={{ fontWeight: "900", color: isEditing ? "white" : tokens.violet }}>
          {isEditing ? "Done" : "Edit"}
        </Text>
      </Pressable>
    </View>
  );
}