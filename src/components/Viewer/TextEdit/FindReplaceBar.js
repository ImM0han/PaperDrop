import React, { useMemo, useState } from "react";
import { View, TextInput, Text, Pressable } from "react-native";
import { tokens } from "../../../styles/tokens";
import { useTextEditStore } from "../../../store/textEditStore";

export default function FindReplaceBar({ docId, onDirty }) {
  const blocksByDoc = useTextEditStore((s) => s.blocksByDoc);
  const updateBlock = useTextEditStore((s) => s.updateBlock);

  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");

  const allBlocks = useMemo(() => Object.values(blocksByDoc[docId] || {}).flat(), [blocksByDoc, docId]);

  const matches = useMemo(() => {
    if (!find) return [];
    const f = find.toLowerCase();
    return allBlocks.filter((b) => (b.content || "").toLowerCase().includes(f));
  }, [allBlocks, find]);

  return (
    <View style={{ padding: 10, backgroundColor: tokens.card, borderBottomWidth: 1, borderBottomColor: tokens.border }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ fontWeight: "900", marginRight: 8 }}>Find:</Text>
        <TextInput
          value={find}
          onChangeText={setFind}
          placeholder="Find"
          style={{ flex: 1, borderWidth: 1, borderColor: tokens.border, borderRadius: 12, padding: 10, marginRight: 8 }}
        />
        <Text style={{ fontWeight: "900", color: tokens.muted }}>
          {matches.length ? `${matches.length} match` : "0"}
        </Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
        <TextInput
          value={replace}
          onChangeText={setReplace}
          placeholder="Replace"
          style={{ flex: 1, borderWidth: 1, borderColor: tokens.border, borderRadius: 12, padding: 10, marginRight: 8 }}
        />

        <Pressable
          onPress={() => {
            if (!find) return;
            const f = find;
            matches.forEach((b) => {
              updateBlock(docId, b.pageNumber, b.blockId, {
                content: (b.content || "").split(f).join(replace),
                isDirty: true,
              });
            });
            onDirty?.();
          }}
          style={{ backgroundColor: tokens.violet, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12 }}
        >
          <Text style={{ color: "white", fontWeight: "900" }}>Replace All</Text>
        </Pressable>
      </View>
    </View>
  );
}