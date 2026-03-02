import React from "react";
import { ScrollView, Pressable, Text, View } from "react-native";
import { tokens } from "../../styles/tokens";

function Chip({ label, bg, color, onPress }) {
  return (
    <Pressable onPress={onPress}
      style={{ paddingVertical: 10, paddingHorizontal: 14, borderRadius: 9999, backgroundColor: bg, marginRight: 10 }}>
      <Text style={{ fontWeight: "800", color }}>{label}</Text>
    </Pressable>
  );
}

export default function QuickChips({ onScan, onView, onMerge, onEditText, onExport }) {
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Chip label="Scan"      bg="#E3F8E6" color={tokens.mint}   onPress={onScan} />
        <Chip label="View"      bg="#E0F7F6" color={tokens.sky}    onPress={onView} />
        <Chip label="Merge"     bg="#EDEAFF" color={tokens.violet} onPress={onMerge} />
        <Chip label="Edit Text" bg="#FFF0FA" color={tokens.pink}   onPress={onEditText} />
        <Chip label="Export"    bg="#FFE8E8" color={tokens.coral}  onPress={onExport} />
      </ScrollView>
    </View>
  );
}