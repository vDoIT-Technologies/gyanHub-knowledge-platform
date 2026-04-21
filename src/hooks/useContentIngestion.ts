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
    mutationFn: async ({ teacherId, title, text, files, ownerId }: ContentIngestionParams) => {
      const hasFiles = !!(files && files.length > 0);
      const hasText = !!text?.trim();

      if (hasFiles && hasText) {
        throw new Error('Please provide either text or documents, not both.');
      }

      if (!hasFiles && !hasText) {
        throw new Error('Please provide text or at least one document.');
      }

      if (hasFiles) {
        const formData = new FormData();
        for (const file of files || []) {
          formData.append('files', file);
        }
        if (title?.trim()) formData.append('title', title.trim());
        if (ownerId) formData.append('ownerId', ownerId);
        if (teacherId) formData.append('teacherId', teacherId);
        formData.append('generate_embeddings', 'true');

        const res = await api.post('/documents', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return (res.data || {}) as ContentIngestionResponse;
      }

      const res = await api.post('/documents', {
        text: text.trim(),
        ownerId: ownerId,
        teacherId: teacherId || undefined,
        ...(title?.trim() ? { title: title.trim() } : {}),
        generate_embeddings: true,
      });

      return (res.data || {}) as ContentIngestionResponse;
    },
  });
}
