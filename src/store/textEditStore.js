import { create } from "zustand";

export const useTextEditStore = create((set, get) => ({
  isEditing: false,
  setIsEditing: (v) => set({ isEditing: v }),

  // overlays are per document
  blocksByDoc: {}, // { [docId]: { [pageNumber]: [blocks...] } }
  pageSizesByDoc: {}, // { [docId]: { [pageNumber]: {width,height} } }

  activeBlockId: null,
  setActiveBlockId: (id) => set({ activeBlockId: id }),

  history: [],
  future: [],

  setPageSize: (docId, pageNumber, size) => {
    const map = { ...(get().pageSizesByDoc[docId] || {}) };
    map[pageNumber] = size;
    set({ pageSizesByDoc: { ...get().pageSizesByDoc, [docId]: map } });
  },

  addBlock: (docId, pageNumber, block) => {
    const all = { ...(get().blocksByDoc[docId] || {}) };
    const arr = [...(all[pageNumber] || [])];
    arr.push(block);
    all[pageNumber] = arr;
    set({ blocksByDoc: { ...get().blocksByDoc, [docId]: all } });
  },

  updateBlock: (docId, pageNumber, blockId, patch) => {
    const all = { ...(get().blocksByDoc[docId] || {}) };
    const arr = [...(all[pageNumber] || [])].map((b) => (b.blockId === blockId ? { ...b, ...patch } : b));
    all[pageNumber] = arr;
    set({ blocksByDoc: { ...get().blocksByDoc, [docId]: all } });
  },

  removeBlock: (docId, pageNumber, blockId) => {
    const all = { ...(get().blocksByDoc[docId] || {}) };
    const arr = [...(all[pageNumber] || [])].filter((b) => b.blockId !== blockId);
    all[pageNumber] = arr;
    set({ blocksByDoc: { ...get().blocksByDoc, [docId]: all } });
  },

  pushHistory: (action) => {
    const history = [...get().history, action].slice(-50);
    set({ history, future: [] });
  },

  undo: () => {
    const history = [...get().history];
    const last = history.pop();
    if (!last) return;
    const future = [last, ...get().future];

    // apply inverse
    last.inverse?.();
    set({ history, future });
  },

  redo: () => {
    const future = [...get().future];
    const next = future.shift();
    if (!next) return;
    next.apply?.();
    set({ future, history: [...get().history, next].slice(-50) });
  },
}));