import React from "react";
import { View, Pressable, Text, ScrollView } from "react-native";
import { useTextEditStore } from "../../../store/textEditStore";
import { tokens } from "../../../styles/tokens";

export default function TextEditToolbar({ docId, currentPage, onDirty }) {
  const blocksByDoc = useTextEditStore((s) => s.blocksByDoc);
const blocks = blocksByDoc[docId]?.[currentPage] || [];
  const activeId = useTextEditStore((s) => s.activeBlockId);
  const updateBlock = useTextEditStore((s) => s.updateBlock);
  const undo = useTextEditStore((s) => s.undo);
  const redo = useTextEditStore((s) => s.redo);

  const active = blocks.find((b) => b.blockId === activeId);

  function patchStyle(patch) {
    if (!active) return;
    updateBlock(docId, currentPage, active.blockId, { style: { ...active.style, ...patch }, isDirty: true });
    onDirty?.();
  }

  const Btn = ({ label, onPress, activeState }) => (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 14,
        backgroundColor: activeState ? "#FFF0FA" : tokens.card,
        borderWidth: 1,
        borderColor: tokens.border,
        marginRight: 10,
      }}
    >
      <Text style={{ fontWeight: "900", color: activeState ? tokens.pink : tokens.text }}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={{ backgroundColor: tokens.card, borderTopWidth: 1, borderTopColor: tokens.border, paddingVertical: 10 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12 }}>
        <Btn
          label="B"
          activeState={active?.style?.fontWeight === "bold"}
          onPress={() => patchStyle({ fontWeight: active?.style?.fontWeight === "bold" ? "normal" : "bold" })}
        />
        <Btn
          label="I"
          activeState={active?.style?.fontStyle === "italic"}
          onPress={() => patchStyle({ fontStyle: active?.style?.fontStyle === "italic" ? "normal" : "italic" })}
        />
        <Btn
          label="U"
          activeState={active?.style?.textDecoration === "underline"}
          onPress={() => patchStyle({ textDecoration: active?.style?.textDecoration === "underline" ? "none" : "underline" })}
        />
        <Btn label="Size +" onPress={() => patchStyle({ fontSize: Math.min(36, (active?.style?.fontSize || 14) + 2) })} />
        <Btn label="Size -" onPress={() => patchStyle({ fontSize: Math.max(8, (active?.style?.fontSize || 14) - 2) })} />
        <Btn label="Color" onPress={() => patchStyle({ color: active?.style?.color === tokens.coral ? tokens.text : tokens.coral })} activeState={active?.style?.color === tokens.coral} />
        <Btn label="Align" onPress={() => patchStyle({ textAlign: active?.style?.textAlign === "left" ? "center" : active?.style?.textAlign === "center" ? "right" : "left" })} />
        <Btn label="Undo" onPress={undo} />
        <Btn label="Redo" onPress={redo} />
      </ScrollView>
    </View>
  );
}