import { create } from "zustand";

export const useAppStore = create((set) => ({
  activeTab: "home",
  setActiveTab: (tab) => set({ activeTab: tab }),

  hasNewFiles: false,
  setHasNewFiles: (v) => set({ hasNewFiles: v }),

  // Viewer routing state
  currentDocId: null,
  openDoc: (docId) => set({ currentDocId: docId, activeTab: "view" }),
  closeDoc: () => set({ currentDocId: null, activeTab: "home" }),
}));