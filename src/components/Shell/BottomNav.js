import React from "react";
import { View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppStore } from "../../store/appStore";
import { TABS } from "../../utils/constants";
import { tokens } from "../../styles/tokens";

export default function BottomNav() {
  const activeTab = useAppStore((s) => s.activeTab);
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const hasNewFiles = useAppStore((s) => s.hasNewFiles);
  const insets = useSafeAreaInsets?.() || { bottom: 0 };

  return (
    <View
      style={{
        paddingBottom: Math.max(insets.bottom, 10),
        paddingTop: 10,
        paddingHorizontal: 14,
        borderTopWidth: 1,
        borderTopColor: tokens.border,
        backgroundColor: tokens.card,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {TABS.map((t) => {
          const active = t.key === activeTab;
          const activeColor = tokens[t.activeColor] || tokens.violet;
          return (
            <Pressable
              key={t.key}
              onPress={() => setActiveTab(t.key)}
              style={{
                width: "24%",
                alignItems: "center",
                paddingVertical: 10,
                borderRadius: tokens.radiusPill,
                backgroundColor: active ? "#F5F3FF" : "transparent",
                transform: [{ translateY: active ? -2 : 0 }],
              }}
            >
              <View style={{ position: "relative" }}>
                <Text style={{ fontSize: 20, color: active ? activeColor : tokens.muted }}>
                  {t.icon}
                </Text>
                {t.key === "home" && hasNewFiles ? (
                  <View
                    style={{
                      position: "absolute",
                      right: -2,
                      top: -2,
                      width: 8,
                      height: 8,
                      borderRadius: 99,
                      backgroundColor: tokens.coral,
                    }}
                  />
                ) : null}
              </View>
              <Text
                style={{
                  marginTop: 4,
                  fontSize: 11,
                  fontWeight: "700",
                  color: active ? (t.key === "scan" ? tokens.mint : tokens.violet) : tokens.muted,
                }}
              >
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}