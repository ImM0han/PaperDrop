import React from "react";
import { View, Pressable, Text } from "react-native";
import { useTextEditStore } from "../../../store/textEditStore";
import { tokens } from "../../../styles/tokens";
import EditableTextBlock from "./EditableTextBlock";

export default function EditModeOverlay({ docId, currentPage, onDirty }) {
const { blocksByDoc, pageSizesByDoc, addBlock } = useTextEditStore((s) => ({
  blocksByDoc: s.blocksByDoc,
  pageSizesByDoc: s.pageSizesByDoc,
  addBlock: s.addBlock,
}));

  const blocks = (blocksByDoc[docId]?.[currentPage] || []);
  const pageSize = pageSizesByDoc[docId]?.[currentPage];

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}
    >
      {/* Tap-to-add helper */}
      <View style={{ position: "absolute", top: 10, left: 12, right: 12 }}>
        <View style={{ backgroundColor: "#FFFBEA", borderRadius: 14, padding: 10, borderWidth: 1, borderColor: "#FFE9A6" }}>
          <Text style={{ fontWeight: "900", color: tokens.text }}>
           {"Tap + Text below, then drag/resize the block where you want to edit text."}
          </Text>
          <Text style={{ marginTop: 4, fontWeight: "700", color: tokens.muted, fontSize: 12 }}>
            This writes into the PDF by covering the old area + drawing new text (offline).
          </Text>
        </View>
      </View>

      {blocks.map((b) => (
        <EditableTextBlock key={b.blockId} docId={docId} pageNumber={currentPage} block={b} onDirty={onDirty} />
      ))}

      {/* Add new block */}
      <View style={{ position: "absolute", left: 12, right: 12, bottom: 82 }}>
        <Pressable
          onPress={() => {
            const blockId = `blk_${Date.now()}_${Math.random().toString(16).slice(2)}`;
            addBlock(docId, currentPage, {
              blockId,
              pageNumber: currentPage,
              content: "Type here",
              position: { x: 40, y: 140, width: 220, height: 44 },
              style: {
                fontSize: 14,
                fontWeight: "normal",
                fontStyle: "normal",
                textDecoration: "none",
                color: tokens.text,
                textAlign: "left",
                fontFamily: "Nunito Sans",
              },
              isDirty: true,
            });
            onDirty?.();
          }}
          style={{
            backgroundColor: tokens.pink,
            borderRadius: tokens.radiusPill,
            paddingVertical: 12,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "900" }}>+ Text Block</Text>
        </Pressable>
      </View>
    </View>
  );
}