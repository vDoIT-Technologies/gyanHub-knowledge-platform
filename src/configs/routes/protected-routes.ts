import { lazy } from "react";
export interface ProtectedRouteInterface {
  path: string;
  key: string;
  name: string;
  component: any;
}

export const protectedRoutes = [
  {
    name: "Home",
    key: "chat",
    path: "/chat",
    component: lazy(() => import("../../pages/user/sophiaChat")),
  },
  {
    name: "Home",
    key: "chat",
    path: "/chat/:assistantId",
    component: lazy(() => import("../../pages/user/sophiaChat")),
  },
  {
    name: "Home",
    key: "chat",
    path: "/chat/:assistantId/:sessionId",
    component: lazy(() => import("../../pages/user/sophiaChat")),
  },
  {
    name: "Profile",
    key: "profile",
    path: "/profile",
    component: lazy(() => import("../../pages/user/Profile")),
  },
  {
    name: "Edit Profile",
    key: "edit-profile",
    path: "/edit-profile",
    component: lazy(() => import("../../pages/user/Profile/components/EditProfile")),
  },
  
  {
    name: "Vault",
    key: "vault",
    path: "/chat-session",
    component: lazy(() => import("../../pages/user/chat-session")),
  },
  {
    name: "Avatar Chat",
    key: "avatarChat",
    path: "/avatar-chat",
    component: lazy(() => import("../../pages/video-chat/TeacherSelect")),
  },
  {
    name: "Avatar Chat Session",
    key: "avatarChatSession",
    path: "/avatar-chat/:teacherId",
    component: lazy(() => import("../../pages/video-chat/VideoChat")),
  },
  
  {
    name: "AI Assistants",
    key: "aiAssistants",
    path: "/ai-assistants",
    component: lazy(() => import("../../pages/ai-assistants/PersonalityList")),
  },
  {
    name: "Quiz Generation",
    key: "quiz-generation",
    path: "/quiz-generation",
    component: lazy(() => import("../../pages/quiz/QuizPage")),
  },
  {
    name: "Content Generation",
    key: "content-generation",
    path: "/content-generation",
    component: lazy(() => import("../../pages/content/ContentPage")),
  },
];

export const protectedRouteNames = protectedRoutes.map((route) => route.key);

export const protectedRoutePaths = protectedRoutes.map((route) => route.path);

export default protectedRoutes;
