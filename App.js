import React, { useEffect } from "react";
import { SafeAreaView, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import PhoneShell from "./src/components/Shell/PhoneShell";
import BottomNav from "./src/components/Shell/BottomNav";
import HomeScreen from "./src/components/Home/HomeScreen";
import ViewerScreen from "./src/components/Viewer/ViewerScreen";
import MergeScreen from "./src/components/Merge/MergeScreen";
import ScannerScreen from "./src/components/Scanner/ScannerScreen";
import { useAppStore } from "./src/store/appStore";
import { initDocumentDb } from "./src/services/documentService";
import { tokens } from "./src/styles/tokens";

export default function App() {
  const activeTab = useAppStore((s) => s.activeTab);

  useEffect(() => {
    initDocumentDb().catch(() => {});
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens.bg }}>
      <StatusBar style="dark" />
      <PhoneShell>
        <View style={{ flex: 1 }}>
          {activeTab === "home" && <HomeScreen />}
          {activeTab === "view" && <ViewerScreen />}
          {activeTab === "merge" && <MergeScreen />}
          {activeTab === "scan" && <ScannerScreen />}
        </View>
        <BottomNav />
      </PhoneShell>
    </SafeAreaView>
  );
}