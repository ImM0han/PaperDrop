import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { tokens } from "../../styles/tokens";

// Replace the TOOLS array in AnnotationToolbar.js with this:
const TOOLS = [
  { id: "highlight", label: "Highlight", emoji: "HL" },
  { id: "comment",   label: "Comment",   emoji: "CM" },
  { id: "underline", label: "Underline", emoji: "UL" },
  { id: "draw",      label: "Draw",      emoji: "DR" },
  { id: "text",      label: "Text",      emoji: "T"  },
];

export default function AnnotationToolbar() {
  const [activeTool, setActiveTool] = useState(null);

  return (
    <View style={{
      backgroundColor: "#FFFFFF",
      borderTopWidth: 1,
      borderTopColor: "#EEEAF5",
      paddingVertical: 10,
    }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
      >
        {TOOLS.map((tool) => {
          const isActive = activeTool === tool.id;
          return (
            <Pressable
              key={tool.id}
              onPress={() => setActiveTool(isActive ? null : tool.id)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 8,
                paddingHorizontal: 14,
                borderRadius: 9999,
                backgroundColor: isActive ? "#EEEAF5" : "transparent",
                gap: 6,
              }}
            >
              <Text style={{ fontSize: 16 }}>{tool.emoji}</Text>
              <Text style={{
                fontSize: 12,
                fontWeight: "800",
                color: isActive ? "#2D2D2D" : "#9B9BAE",
              }}>
                {tool.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}