import { StateCreator } from "zustand";
import type { QuizHistory } from "../../types/mcq.types";

export interface MCQSlice {
  quizHistory: QuizHistory[];
  isHistorySidebarOpen: boolean;

  addQuizToHistory: (quiz: QuizHistory) => void;
  removeQuizFromHistory: (quizId: string) => void;
  clearQuizHistory: () => void;
  toggleHistorySidebar: () => void;
  setHistorySidebarOpen: (open: boolean) => void;
  getQuizById: (quizId: string) => QuizHistory | undefined;
}

export const mcqSlice: StateCreator<MCQSlice> = (set, get) => ({
  quizHistory: [],
  isHistorySidebarOpen: true,

  addQuizToHistory: (quiz) =>
    set((state) => ({
      quizHistory: [quiz, ...state.quizHistory].slice(0, 50),
    })),

  removeQuizFromHistory: (quizId) =>
    set((state) => ({
      quizHistory: state.quizHistory.filter(
        (quiz) => quiz.id !== quizId
      ),
    })),

  clearQuizHistory: () => set({ quizHistory: [] }),

  toggleHistorySidebar: () =>
    set((state) => ({
      isHistorySidebarOpen: !state.isHistorySidebarOpen,
    })),

  setHistorySidebarOpen: (open) =>
    set({ isHistorySidebarOpen: open }),

  getQuizById: (quizId) =>
    get().quizHistory.find((quiz) => quiz.id === quizId),
});
