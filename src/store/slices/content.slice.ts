import { StateCreator } from "zustand";
import type { ContentHistory } from "../../types/content.types";

export interface ContentSlice {
  contentHistory: ContentHistory[];
  isHistorySidebarOpen: boolean;

  addContentToHistory: (content: ContentHistory) => void;
  removeContentFromHistory: (contentId: string) => void;
  clearContentHistory: () => void;
  toggleHistorySidebar: () => void;
  setHistorySidebarOpen: (open: boolean) => void;
  getContentById: (contentId: string) => ContentHistory | undefined;
}

export const contentSlice: StateCreator<ContentSlice> = (set, get) => ({
  contentHistory: [],
  isHistorySidebarOpen: true,

  addContentToHistory: (content) =>
    set((state) => ({
      contentHistory: [content, ...state.contentHistory].slice(0, 50),
    })),

  removeContentFromHistory: (contentId) =>
    set((state) => ({
      contentHistory: state.contentHistory.filter(
        (content) => content.id !== contentId
      ),
    })),

  clearContentHistory: () => set({ contentHistory: [] }),

  toggleHistorySidebar: () =>
    set((state) => ({
      isHistorySidebarOpen: !state.isHistorySidebarOpen,
    })),

  setHistorySidebarOpen: (open) =>
    set({ isHistorySidebarOpen: open }),

  getContentById: (contentId) =>
    get().contentHistory.find((content) => content.id === contentId),
});
