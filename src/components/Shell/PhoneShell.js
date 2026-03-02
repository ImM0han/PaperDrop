import React from "react";
import { View } from "react-native";
import { tokens } from "../../styles/tokens";

export default function PhoneShell({ children }) {
  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg }}>
      {children}
    </View>
  );
}