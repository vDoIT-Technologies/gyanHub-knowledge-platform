import { StateCreator } from "zustand";

export interface ChatSlice {
  audio: Blob | null;
  setAudio: (audio: Blob | null) => void;
  audioEnabled: boolean;
  setAudioEnabled: (audioEnabled: boolean) => void;
  wordLimit: number;
  setWordLimit: (wordLimit: number) => void;
  chatMode: string;
  setChatMode: (chatMode: string) => void;
  llm: string;
  setLlm: (llm: string) => void;
}
export const chatSlice: StateCreator<ChatSlice> = (set) => ({
  audio: null,
  setAudio: (audio: Blob | null) => {
    set(() => ({ audio }));
  },
  audioEnabled: true,
  setAudioEnabled: (audioEnabled: boolean) => {
    set(() => ({ audioEnabled }));
  },
  wordLimit: 50,
  setWordLimit: (wordLimit: number) => {
    set(() => ({ wordLimit }));
  },
  chatMode: "Audio",
  setChatMode: (chatMode: string) => {
    set(() => ({ chatMode }));
  },
  llm: "gpt-3.5-turbo",
  setLlm: (llm: string) => {
    set(() => ({ llm }));
  },
});
