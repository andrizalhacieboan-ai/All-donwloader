import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface HistoryItem {
  url: string;
  title: string;
  platform: string;
  createdAt: string;
}

interface HistoryStore {
  history: HistoryItem[];
  addHistory: (item: HistoryItem) => void;
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set) => ({
      history: [],
      addHistory: (item) =>
        set((state) => {
          const filtered = state.history.filter((h) => h.url !== item.url);
          return { history: [item, ...filtered].slice(0, 20) };
        }),
    }),
    { name: 'andri-downloader-history' }
  )
);
