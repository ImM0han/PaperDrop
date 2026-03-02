import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { tokens } from "../../styles/tokens";

export default function CameraFrame({ onCapture }) {
  const camRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!permission) return;
    if (!permission.granted) requestPermission().catch(() => {});
  }, [permission]);

  if (!permission?.granted) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "white", fontWeight: "900" }}>Camera permission required</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 12 }}>
      <View
        style={{
          height: 360,
          borderRadius: 18,
          overflow: "hidden",
          borderWidth: 3,
          borderColor: tokens.mint,
          shadowOpacity: 0.2,
          shadowRadius: 16,
        }}
      >
        <CameraView
          ref={camRef}
          style={{ flex: 1 }}
          onCameraReady={() => setReady(true)}
        />
        {/* Scan line */}
        <View style={{ position: "absolute", left: 0, right: 0, top: 0, height: 2, backgroundColor: tokens.mint, opacity: 0.5 }} />
      </View>

      <Pressable
        disabled={!ready}
        onPress={async () => {
          try {
            const photo = await camRef.current?.takePictureAsync({ quality: 0.9 });
            if (photo?.uri) onCapture?.(photo.uri);
          } catch {}
        }}
        style={{
          marginTop: 10,
          backgroundColor: tokens.mint,
          paddingVertical: 12,
          borderRadius: tokens.radiusPill,
          alignItems: "center",
          opacity: ready ? 1 : 0.6,
        }}
      >
        <Text style={{ color: "#111", fontWeight: "900" }}>Capture</Text>
      </Pressable>
    </View>
  );
}