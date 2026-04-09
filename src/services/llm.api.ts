import llmApi from "./llmconfig";
import type { MCQGenerateRequest, MCQQuestion } from "../types/mcq.types";
import type {
  ContentResponse,
  ContentGenerateRequest,
} from "../types/content.types";

// ─── MCQ ──────────────────────────────────────────────────────────────────────

export const apiGenerateMCQQuestions = async (
  payload: MCQGenerateRequest
): Promise<{ success: boolean; id: string; title: string; difficulty: string; test: MCQQuestion[] }> => {
  const isDev = import.meta.env.VITE_DEV_MODE === "true";

  if (isDev) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return generateMockTest(payload.topic, payload.numberOfQuestions, payload.difficulty);
  }

  // Step 1: POST → get test_id
  const response = await llmApi.post("/tests", {
    topic: payload.topic,
    num_questions: payload.numberOfQuestions,
    difficulty: payload.difficulty,
    ...(payload.teacherId ? { teacherId: payload.teacherId } : {}),
  });

  const test_id = response.data?.test_id;
  if (!test_id) throw new Error("No test_id received from server");

  // Step 2: GET → full test  (API returns { success, id, title, difficulty, test: [...] })
  const { data } = await llmApi.get("/tests", {
    params: { test_id },
  });

  if (!data?.success) throw new Error("Failed to fetch generated test");

  return data;
};

// ─── Content ──────────────────────────────────────────────────────────────────

export const apiGenerateContent = async (
  payload: ContentGenerateRequest
): Promise<ContentResponse> => {
  const isDev = import.meta.env.VITE_DEV_MODE === "true";

  if (isDev) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return generateMockContent(payload.topic, payload.num_slides);
  }

  const response = await llmApi.post("/courses", payload);
  const course_id = response.data?.course_id;
  if (!course_id) throw new Error("No course_id received from server");

  const { data } = await llmApi.get("/courses", {
    params: { course_id },
  });

  return data;
};

// ─── Mock helpers (dev only) ──────────────────────────────────────────────────

const generateMockTest = (
  topic: string,
  count: number,
  difficulty: string
): { success: boolean; id: string; title: string; difficulty: string; test: MCQQuestion[] } => {
  const test: MCQQuestion[] = Array.from({ length: count }, (_, i) => {
    const qId = `mock-q${i + 1}`;
    const opts = ["Option A", "Option B", "Option C", "Option D"].map(
      (text, idx) => ({ id: `${qId}-opt${idx}`, text: `${text} for ${topic}` })
    );
    return {
      id: qId,
      question: `Mock question ${i + 1} about ${topic}?`,
      options: opts,
      correct_ids: [opts[0].id],
      explanation: `Explanation for question ${i + 1} about ${topic}.`,
    };
  });

  return { success: true, id: `mock-${Date.now()}`, title: topic, difficulty, test };
};

const generateMockContent = (topic: string, count: number): ContentResponse => {
  const slides = Array.from({ length: count }, (_, i) => ({
    id: `slide-${i + 1}`,
    title: i === 0 ? `Introduction to ${topic}` : `Chapter ${i}: ${topic}`,
    content: `## Slide ${i + 1}\n\nContent for **${topic}**.`,
  }));
  return { success: true, id: `mock-content-${Date.now()}`, title: topic, slides };
};