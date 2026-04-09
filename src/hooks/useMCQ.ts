import { useMutation, useQuery, useQueryClient } from 'react-query';
import api from '@/services';
import type {
  MCQGenerateRequest,
  MCQTestResponse,
  TestMetadata,
} from '@/types/mcq.types';

// ─── Generate a new test ──────────────────────────────────────────────────────
export function useMCQGeneration() {
  const queryClient = useQueryClient();

  return useMutation<MCQTestResponse, Error, MCQGenerateRequest>({
    mutationFn: async ({ topic, numberOfQuestions, difficulty, teacherId }) => {
      // Step 1: POST /tests → { test_id }
      const idRes = await api.post('/tests', {
        topic,
        num_questions: Number(numberOfQuestions),
        difficulty,
        ...(teacherId ? { teacherId } : {}),
      });

      const testId = idRes.data?.test_id;
      if (!testId) throw new Error('No test_id returned from server');

      // Step 2: GET /tests?test_id=<id> → full test
      const { data } = await api.get('/tests', {
        params: { test_id: testId },
      });

      if (!data?.success) throw new Error('Failed to fetch generated test');

      return data as MCQTestResponse;
    },
    onSuccess: () => {
      // Refresh history sidebar after new test is created
      queryClient.invalidateQueries({ queryKey: ['tests', 'all'] });
    },
    onError: (err) => {
      console.error('[useMCQGeneration] error:', err);
    },
  });
}

// ─── Fetch a single test by ID ────────────────────────────────────────────────
export function useTestById(testId: string | null) {
  return useQuery<MCQTestResponse, Error>({
    queryKey: ['test', testId],
    queryFn: async () => {
      const { data } = await api.get('/tests', {
        params: { test_id: testId },
      });
      if (!data?.success) throw new Error('Test not found');
      return data as MCQTestResponse;
    },
    enabled: !!testId,
    staleTime: 1000 * 60 * 5,
  });
}

// ─── Fetch all tests metadata for history sidebar ─────────────────────────────
export function useAllTestsMetadata() {
  return useQuery<TestMetadata[], Error>({
    queryKey: ['tests', 'all'],
    queryFn: async () => {
      const { data } = await api.get('/tests/all');
      return Array.isArray(data) ? (data as TestMetadata[]) : [];
    },
    staleTime: 1000 * 30,
  });
}