import api from "@/services";

export const apiCreateSession = async (payload: {
  userId: string;
  title: string;
  personalityId:string;
}) => {
  return await api.post("/chat/create-session", payload);
};

export const apiFetchChatSession = async (payload) => {
  return await api.get("/chat/fetch-sessions", { params: payload });
};

export const apiUpdateSession = async (
  sessionId: string,
  payload: { title?: string }
) => {
  return await api.put(`/chat/sessions/${sessionId}`, payload);
};

export const apiDeleteSession = async (sessionId: string) => {
  return await api.delete(`/chat/sessions/${sessionId}`);
};

// ── Avatar Teacher endpoints ───────────────────────────────────────────────

export interface AvatarTeacherPublic {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  points: number;
  isActive: boolean;
  topics: string[];
}

export interface AvatarTeacherConfig extends AvatarTeacherPublic {
  presenterId?: string;
  sourceUrl?: string;
  service: string;
  voiceId?: string;
  systemPrompt?: string;
  topics: string[];
}

export const apiGetAvatarTeachers = async (): Promise<AvatarTeacherPublic[]> => {
  const res = await api.get<{ success: boolean; data: AvatarTeacherPublic[] }>("/chat/avatar-teachers");
  return res.data.data;
};

export const apiGetTeacherConfig = async (teacherId: string): Promise<AvatarTeacherConfig> => {
  const res = await api.get<{ success: boolean; data: AvatarTeacherConfig }>(`/chat/teacher-config/${teacherId}`);
  return res.data.data;
};

