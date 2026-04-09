import { lazy } from "react";

export const allRoutes = [
  {
    key: "chat",
    path: "/chat",
    component: lazy(() => import("../../pages/user/sophiaChat")),
  },
  {
    key: "profile",
    path: "/profile",
    component: lazy(() => import("../../pages/user/Profile")),
  },
  {
    key: "edit-profile",
    path: "/edit-profile",
    component: lazy(() => import("../../pages/user/Profile/components/EditProfile")),
  },
  {
    key: "vault",
    path: "/chat-session",
    component: lazy(() => import("../../pages/user/chat-session")),
  },
  {
    key: "quiz",
    path: "/quiz-generation",
    component: lazy(() => import("@/pages/quiz/QuizPage")),
  },
  {
    key: "content",
    path: "/content-generation",
    component: lazy(() => import("@/pages/content/ContentPage")),
  },
  
];
