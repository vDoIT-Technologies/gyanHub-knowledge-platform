import api from "@/services";

export interface ChatRequest {
  sessionId: string;
  message: string;
  userId: string;
  personalityId: string;
  wordLimit: number;
  modelName: string;
}

export interface ChatResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export const createChat = async (
  payload: ChatRequest
): Promise<ChatResponse> => {
  const { data: response } = await api.post<ChatResponse>(
    `${import.meta.env.VITE_PERSONA_BASE_URL}/chat/create`,
    payload,
    {
      headers: {
        "persona-api-key": import.meta.env.VITE_PERSONA_API_KEY,
      },
    }
  );

  if (!response.success) {
    console.error("Failed to get response from persona LLM");
  }

  return response;
};
