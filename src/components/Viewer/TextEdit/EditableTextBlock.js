import React, { useMemo, useState } from "react";
import { View, TextInput, Pressable, Text } from "react-native";
import { useTextEditStore } from "../../../store/textEditStore";
import { tokens } from "../../../styles/tokens";

export default function EditableTextBlock({ docId, pageNumber, block, onDirty }) {
  const updateBlock = useTextEditStore((s) => s.updateBlock);
  const removeBlock = useTextEditStore((s) => s.removeBlock);
  const activeBlockId = useTextEditStore((s) => s.activeBlockId);
  const setActiveBlockId = useTextEditStore((s) => s.setActiveBlockId);

  const isActive = activeBlockId === block.blockId;
  const [local, setLocal] = useState(block.content);

  const boxStyle = useMemo(() => {
    if (!isActive) {
      return {
        borderStyle: "dashed",
        borderColor: tokens.coral,
        borderWidth: 1,
        backgroundColor: "#FFFBEA",
      };
    }
    return {
      borderStyle: "solid",
      borderColor: tokens.coral,
      borderWidth: 2,
      backgroundColor: tokens.card,
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 3,
    };
  }, [isActive]);

  return (
    <View
      style={{
        position: "absolute",
        left: block.position.x,
        top: block.position.y,
        width: block.position.width,
        height: block.position.height,
        borderRadius: 8,
        ...boxStyle,
      }}
    >
      <Pressable
        onPress={() => setActiveBlockId(block.blockId)}
        style={{ flex: 1, paddingHorizontal: 8, paddingVertical: 6 }}
      >
        <TextInput
          value={local}
          onChangeText={(t) => {
            setLocal(t);
            updateBlock(docId, pageNumber, block.blockId, { content: t, isDirty: true });
            onDirty?.();
          }}
          multiline
          style={{
            flex: 1,
            fontSize: block.style.fontSize || 14,
            fontWeight: block.style.fontWeight === "bold" ? "800" : "600",
            fontStyle: block.style.fontStyle === "italic" ? "italic" : "normal",
            textDecorationLine: block.style.textDecoration === "underline" ? "underline" : "none",
            color: block.style.color || tokens.text,
            textAlign: block.style.textAlign || "left",
          }}
        />
      </Pressable>

      {isActive ? (
        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 8, paddingBottom: 6 }}>
          <Text style={{ fontSize: 11, fontWeight: "900", color: tokens.muted }}>Active</Text>
          <Pressable
            onPress={() => {
              removeBlock(docId, pageNumber, block.blockId);
              onDirty?.();
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "900", color: tokens.coral }}>Delete</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}