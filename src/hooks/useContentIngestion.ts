import { useMutation } from 'react-query';
import api from '@/services';

export interface ContentIngestionParams {
  teacherId?: string;
  title?: string;
  text?: string;
  files?: File[];
  ownerId?:any;
}

export interface ContentIngestionResponse {
  success?: boolean;
  id?: string;
  message?: string;
  [key: string]: unknown;
}

/**
 * Sends user-provided text to the backend for persistence (DB) + ingestion.
 *
 * Backend contract (expected):
 * - POST /documents (application/json)
 * - body: { text, ownerId?, title?, generate_embeddings }
 *
 * Note: File upload is not supported here unless the backend provides a
 * corresponding endpoint. If you need file ingestion, add the backend route and
 * then wire it up.
 */
export function useContentIngestion() {
  return useMutation<ContentIngestionResponse, Error, ContentIngestionParams>({
    mutationFn: async ({ teacherId, title, text, files }: ContentIngestionParams) => {
      if (files && files.length > 0) {
        throw new Error(
          'File upload ingestion is not configured (backend endpoint missing). Paste text instead.'
        );
      }

      if (!text?.trim()) {
        throw new Error('Text is required.');
      }

      const res = await api.post('/documents', {
        text: text.trim(),
        ...(teacherId ? { ownerId: teacherId } : {}),
        ...(title?.trim() ? { title: title.trim() } : {}),
        ownerId:"da8cd9f7-b56a-4d95-b080-6391c29a0c27",
        generate_embeddings: true,
      });

      return (res.data || {}) as ContentIngestionResponse;
    },
  });
}
