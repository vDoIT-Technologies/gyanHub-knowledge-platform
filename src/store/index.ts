import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  profileSlice,
  ProfileSlice,
  TokenSlice,
  tokenSlice,
  userSlice,
  UserSlice,
} from "./slices/user.slice";
import { chatSlice, ChatSlice } from "./slices/chat.slice";
import { mcqSlice, MCQSlice } from "./slices/mcq.slice";
import { contentSlice, ContentSlice } from "./slices/content.slice";

export const useUserStore = create<UserSlice>()(
  persist(
    (...a) => ({
      ...userSlice(...a),
    }),
    { name: "user-store" }
  )
);
export const useChatStore = create<ChatSlice>()(
  persist(
    (...a) => ({
      ...chatSlice(...a),
    }),
    { name: "chat-store" }
  )
);
export const useProfileStore = create<ProfileSlice>()((...a) => ({
  ...profileSlice(...a),
}));

export const useTokenStore = create<TokenSlice>()(
  persist(
    (...a) => ({
      ...tokenSlice(...a),
    }),
    { name: "auth-store" }
  )
);

export const useMCQStore = create<MCQSlice>()(
  persist(
    (...a) => ({
      ...mcqSlice(...a),
    }),
    {
      name: "mcq-store",
      partialize: (state) => ({
        quizHistory: state.quizHistory,
        isHistorySidebarOpen: state.isHistorySidebarOpen,
      }),
    }
  )
);

export const useContentStore = create<ContentSlice>()(
  persist(
    (...a) => ({
      ...contentSlice(...a),
    }),
    {
      name: "content-store",
      partialize: (state) => ({
        contentHistory: state.contentHistory,
        isHistorySidebarOpen: state.isHistorySidebarOpen,
      }),
    }
  )
);

